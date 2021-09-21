const csv = require('csv-parser')
const fs = require('fs')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const moment = require('moment');
const slug = require('slug');

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

      const state = await prisma.state.findFirst({ where: { legacy_id: parseInt(city.state_id) } });

      const createCity = await prisma.city.create({ 
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



