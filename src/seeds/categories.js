import csv from 'csv-parser'
import fs from 'fs'
import { prisma } from '../database/client.js'

const categories = [];

fs.createReadStream('src/seeds/csv/categories.csv')
  .on('error', () => {
    console.log('érror');
  })

  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    const category = {
      id: row['category_id'], 
      name: row['category_name'], 
      parent_id: row['category_parent_id']
    }
    categories.push(category)
  })

  .on('end', () => {
    categories.forEach(async (category) => {
      const upsertCountry = await prisma.categories.upsert({
        where: {
          id: parseInt(category.id)
        },
        update: {},
        create: {
          id: parseInt(category.id),
          name: category.name,
          is_active: true
        }
      });
    });
  });



