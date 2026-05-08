import { prisma } from '../../lib/prisma';

const createCategory = async (payload: { name: string; description?: string }) => {
  return await prisma.category.create({
    data: payload
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany();
};

const updateCategory = async (id: string, payload: any) => {
  return await prisma.category.update({
    where: { id },
    data: payload
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id }
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};
