import csv from 'csv-parser'
import fs from 'fs'
import slug from 'slug'
import { prisma } from '../database/client.js'

const cities = [];

fs.createReadStream('src/seeds/csv/cities.csv')
  .on('error', () => {
  })

  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    const city = {
      id: row['city_id'], 
      name: row['city_name'], 
      latitude: row['city_latitude'], 
      longitude: row['city_longitude'], 
      state_id: row['state_id']
    }
    cities.push(city)
  })

  .on('end', () => {
    cities.forEach(async (city) => {

      const state = await prisma.states.findFirst({ where: { legacy_id: parseInt(city.state_id) } });

      const createCity = await prisma.cities.create({ 
        data: {
          name: city.name, 
          latitude: city.latitude, 
          longitude: city.longitude, 
          is_active: true,       
          slug: slug(state.id+"-"+city.name),    
          state: {
            connect: { id: state.id }
          }          
        },
        include: {
          state: true
        }           
      });
    });
  });



