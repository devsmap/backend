import csv from 'csv-parser'
import fs from 'fs'
import { prisma } from '../database/client.js'

const states = [];
const SPECIAL_KEY_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

fs.createReadStream('src/seeds/csv/states.csv')
  .on('error', () => {
  })

  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    const state = {
      id: row['state_id'], 
      country_id: row['country_id'], 
      country_name: row['country_name'], 
      name: row['state_name'] 
    }
    states.push(state)
  })

  .on('end', () => {
    states.forEach(async (state) => {
      let uule_name = state.name + ', ' + state.country_name 
      let encode_uule = ("w+CAIQICI"+SPECIAL_KEY_TABLE[uule_name.length]+Buffer.from(uule_name).toString('base64')).replace(/[=]/g, '')
      
      const country = await prisma.countries.findFirst({ where: { legacy_id: parseInt(state.country_id) } });

      const createState = await prisma.states.create({ 
        data: {
          name: state.name, 
          google_uule: encode_uule, 
          is_active: true, 
          is_collected: true,        
          legacy_id: parseInt(state.id), 
          country: {
            connect: { id: country.id }
          }              
        },
        include: {
          country: true
        }           
      });
    });
  });



