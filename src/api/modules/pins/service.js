import { PrismaError } from 'prisma-error-enum'
import { prisma } from '~database/client'

export const allByCategories = function(category_id) {
    const jobs = prisma.$queryRaw`SELECT * FROM jobs`

    return jobs;
};

//   jobs = Job.select(" jobs.category_id
//   ,cities.id as city_id
//   ,cities.latitude
//   ,cities.longitude
//   ,sum(1) as total")
// .joins(:city, :company)
// .where(category: params[:category_id].to_i, company: {is_customer: false})
// .group('jobs.category_id, cities.id')