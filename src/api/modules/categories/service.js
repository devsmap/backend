import { PrismaError } from 'prisma-error-enum'
import { prisma } from './src/database/client.js'

export const findAllCategories = () =>
  prisma.categories.findMany({ 
     where: { is_active: true } 
    ,select: { id: true, name: true }
  });
