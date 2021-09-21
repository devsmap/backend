const moment = require('moment');
const slug = require('slug');
const got = require('got');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {

  const countries = await prisma.country.findMany({ where: { is_collected: true } });
  countries.forEach(async (country) => {  
    const states = await prisma.state.findMany({ where: { country_id: parseInt(country.id), is_collected: true }, include: { cities: true } });
    const categories = await prisma.category.findMany({ where: { is_active: true } });
    states.forEach(async (state, index) => {
      setTimeout(() => {

        categories.forEach(async (category) => {               
          let url  = build_url(category, state, country);
          
          collect_jobs(category, country, state, url);
        });

      }, 2000 * index);

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
      url += "&api_key=bebfd52dac171994660134ca1f3d5a0146e7f7dea592dff3ba25082864bbc98f"

      console.log(category.name + "/ " + state.name + "/ " + url);

  return url;
}

function collect_jobs(category, country, state, url) {
  got.get(url, {responseType: 'json'})
  .then(res => {

    if (typeof res.body['jobs_results'] != "undefined") {
      
      res.body['jobs_results'].forEach(async (job) => {

        if (!((/Qualquer lugar|Anywhere/).test(job.location) || (job.location == state.name) || (!job.location || job.location.length === 0 ) )) {
          if ((/hora|hour|minuto|minute|dia|day|día/).test(job.detected_extensions.posted_at)) {

            let posted_at = job.detected_extensions.posted_at;
            let posted_at_int = parseInt(posted_at.match( /\d+/g )[0])

            if ((/dia|day|día/).test(posted_at) && posted_at_int > 15) {
              return;
            }

            let city_name_slug = slug(state.id+"-"+job.location.replace(/[^A-Za-z]/g, ' ').split('  ')[0]);
            const cities = await prisma.city.findFirst({ where: { slug: city_name_slug } });

            if (!!cities) {
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
              
              let companies = await prisma.company.findFirst({ where: { slug: slug(job.company_name) } });
              if (!companies) {
                companies = await prisma.company.create({ 
                  data: {
                    name: job.company_name, 
                    slug: slug(job.company_name)     
                  }      
                });

                console.log(companies);
              }

              

              // let jobs = await prisma.job.findFirst({ where: { gogole_job_id: job.job_id } });
              // if (!jobs) {
              //   jobs = await prisma.job.create({ 
              //     data: {
              //       category: {
              //         connect: { id: category.id },
              //       },     
              //       city: {
              //         connect: { id: cities.id },
              //       },
              //       company: {
              //         connect: { id: companies.id },
              //       },          
              //       is_active: true,                                             
              //       title: job.title,
              //       description: job.description,
              //       via: job.via,
              //       published_at: posted_at_datetime,
              //       gogole_job_id: job.job_id
              //     }      
              //   });
              // }
            } else {
              const createCityNotFound = await prisma.city_not_found.create({ 
                data: {
                  state_id: state.id,
                  name: job.location, 
                  created_at: moment().format()                    
                } 
              });            
            }
          }
        }
      });
    }
  })
  .catch(err => {
    console.log('Error: ', err.message);
  });
}
