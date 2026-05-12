"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = require("../../lib/prisma");
const createCategory = async (payload) => {
    return await prisma_1.prisma.category.create({
        data: payload
    });
};
const getAllCategories = async () => {
    return await prisma_1.prisma.category.findMany();
};
const updateCategory = async (id, payload) => {
    return await prisma_1.prisma.category.update({
        where: { id },
        data: payload
    });
};
const deleteCategory = async (id) => {
    return await prisma_1.prisma.category.delete({
        where: { id }
    });
};
exports.CategoryService = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
