import { PrismaError } from 'prisma-error-enum'
import { prisma } from '~database/client'

export const findAllCategories = () =>
  prisma.category.findMany({ 
     where: { is_active: true } 
    ,select: { id: true, name: true }
  });