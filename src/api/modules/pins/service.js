import { prisma } from '~database/client'

export const allByCategories = function(category_id) {
    const jobs = prisma.$queryRawUnsafe(
      `SELECT  jobs.category_id
              ,cities.id as city_id
              ,cities.latitude
              ,cities.longitude
              ,sum(1) as total
      FROM jobs
      INNER JOIN cities ON cities.id = jobs.city_id
      INNER JOIN companies ON companies.id = jobs.company_id
      WHERE category_id = $1 AND companies.is_customer = false
      GROUP BY jobs.category_id, cities.id`,
      parseInt(category_id)
    )

    return jobs;
};
