import { prisma } from '../../../database/client.js'

export const allByCategoryAndCity = function(category_id, city_id) {
    const jobs = prisma.$queryRawUnsafe(
      `SELECT  jobs.*
              ,categories.name as category_name
              ,companies.name as company_nam
      FROM jobs
      INNER JOIN categories ON categories.id = jobs.category_id
      INNER JOIN companies ON companies.id = jobs.company_id
      WHERE jobs.category_id = $1 AND jobs.city_id = $2`,
      parseInt(category_id),
      parseInt(city_id)
    );

    return jobs;
};
