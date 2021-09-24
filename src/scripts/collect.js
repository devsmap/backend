import moment from 'moment'
import colors from 'colors'
import slug from 'slug'
import got from 'got'
import nodeGeocoder from "node-geocoder";
import { prisma } from '../database/client.js'
import { config } from 'dotenv'
config({ path: '.env' })

const options = {
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY, 
  formatter: null
};
const geocoder = nodeGeocoder(options);

(async () => {

  const countries = await prisma.countries.findMany({ where: { is_collected: true } });
  countries.forEach(async (country) => {  
    const states = await prisma.states.findMany({ where: { country_id: parseInt(country.id), is_collected: true }, include: { cities: true } });
    const categories = await prisma.categories.findMany({ where: { is_active: true } });
    states.forEach(async (state, index) => {
      setTimeout(() => {

        categories.forEach(async (category) => {               
          let url  = build_url(category, state, country);
          
          collect_jobs(category, country, state, url);
        });

      }, 1000 * index);

    });
  })

})();

function build_url(category, state, country) {
  var url = "https://serpapi.com/search.json?engine=google_jobs";
      url += "&q="+ state.name + "+" + escape(category.name);
      url += "&gl=" + country.google_gl;      
      url += "&hl=" + country.google_hl;
      url += "&uule=" + state.google_uule;
      url += "&chips=date_posted:week";
      url += "&api_key="+process.env.SERPAPI_KEY

  return url;
}

function collect_jobs(category, country, state, url) {
  got.get(url, {responseType: 'json'})
  .then(res => {

    if (typeof res.body['jobs_results'] != "undefined") {
      
      console.log((country.name + " / " + state.name + " / " + category.name + " / " + res.body['jobs_results'].length).brightYellow);

      res.body['jobs_results'].forEach(async (job, index) => {

        setTimeout(async () => {

          const jobs = await prisma.jobs.findFirst({ where: { gogole_job_id: job.job_id } });
          if (!(jobs) == false)
            return;

          if (!((/Qualquer lugar|Anywhere/).test(job.location) || (job.location == state.name) || (!job.location || job.location.length === 0 ) )) {
            if ((/hora|hour|minuto|minute|dia|day|día/).test(job.detected_extensions.posted_at)) {

              let posted_at = job.detected_extensions.posted_at;
              let posted_at_int = parseInt(posted_at.match( /\d+/g )[0])

              if ((/dia|day|día/).test(posted_at) && posted_at_int > 15) {
                console.log(("- " + job.title + " / " + job.location + " / " + job.detected_extensions.posted_at).brightRed);
                return;
              }

              console.log(("+ " + job.title + " / " + job.location + " / " + job.detected_extensions.posted_at).brightGreen);

              let city_name = job.location.replace(/[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]/g, ' ').split('  ')[0];
              let city_name_slug = slug(state.id+"-"+city_name);
              
              res = await geocoder.geocode(city_name + ", "+ state.name + ", " +country.name)
              const cities = await prisma.cities.upsert({
                where: {
                  slug: city_name_slug,
                },
                update: {},
                create: {
                  name: city_name, 
                  latitude: String(res[0].latitude), 
                  longitude: String(res[0].longitude), 
                  is_active: true,       
                  slug: slug(state.id+"-"+city_name),    
                  by_bot: true,
                  state: {
                    connect: { id: state.id }
                  }       
                },
              });

              let posted_at_datetime = '';
              switch (posted_at) {
                case posted_at.match(/hora|hour|minuto|minute/)?.input:

                  switch (posted_at) {
                    case posted_at.match(/hora|hour|/)?.input:
                      posted_at_datetime = moment().subtract(posted_at_int, 'hours').format();
                      break;
                      case posted_at.match(/minuto|minute|/)?.input:
                        posted_at_datetime = moment().subtract(posted_at_int, 'minute').format();
                        break;                      
                  }

                  break;
                case posted_at.match(/dia|day|día/)?.input:
                  posted_at_datetime = moment().subtract(posted_at_int, 'days').format();
                  break;
              }

              const upsertCompany = await prisma.companies.upsert({
                where: {
                  slug: slug(job.company_name),
                },
                update: {},
                create: {
                  name: job.company_name, 
                  slug: slug(job.company_name)
                },
              });

              const upsertJob = await prisma.jobs.upsert({
                where: {
                  gogole_job_id: job.job_id,
                },
                update: {},
                create: {
                  category: {
                    connect: { id: category.id },
                  },     
                  city: {
                    connect: { id: cities.id },
                  },
                  company: {
                    connect: { id: upsertCompany.id },
                  },          
                  is_active: true,                                             
                  title: job.title,
                  description: job.description,
                  via: job.via,
                  published_at: posted_at_datetime,
                  gogole_job_id: job.job_id
                },
              });  
             
            } else {
              console.log(("- " + job.title + " / " + job.location + " / " + job.detected_extensions.posted_at).brightRed);
            }
          } else {
            console.log(("- " + job.title + " / " + job.location + " / " + job.detected_extensions.posted_at).brightRed);
          }
          
        }, 500 * index);          
      });
    }
  })
  .catch(err => {
    console.log('Error: ', err.message);
  });
}
