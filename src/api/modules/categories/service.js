import { PrismaError } from 'prisma-error-enum'
import { prisma } from '/Users/414n/workspace/devsmap/backend/src/database/client.js'

export const findAllCategories = () =>
  prisma.categories.findMany({ 
     where: { is_active: true } 
    ,select: { id: true, name: true }
  });
