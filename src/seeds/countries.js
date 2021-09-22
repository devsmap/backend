import csv from 'csv-parser'
import fs from 'fs'
import { prisma } from '../database/client.js'

const countries = [];

fs.createReadStream('src/seeds/csv/countries.csv')
  .on('error', () => {
  })

  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    const country = {
      id: row['country_id'], 
      name: row['country_name'], 
      region: row['country_region'], 
      subregion: row['country_subregion'], 
      google_gl: row['country_google_gl'], 
      google_hl: row['country_google_hl'],   
    }
    countries.push(country)
  })

  .on('end', () => {
    countries.forEach(async (country) => {
      const createCountry = await prisma.countries.create({ 
        data: {
          name: country.name, 
          region: country.region, 
          subregion: country.subregion, 
          google_gl: country.google_gl, 
          google_hl: country.google_hl,
          legacy_id: parseInt(country.id) 
        } 
      });
    });
  });
  



