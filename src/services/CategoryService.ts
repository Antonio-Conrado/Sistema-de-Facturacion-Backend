import { prisma } from '../config/db';
import { HttpError } from '../config/HttpError';
import { Categories } from '@prisma/client';

export class CategoryService {
    static createCategory = async (category: Categories) => {
        const { name } = category;
        const categoryExists = await prisma.categories.findUnique({
            where: { name },
        });
        if (categoryExists) {
            throw new HttpError('La categoria ya existe', 409);
        }
        await prisma.categories.create({ data: category });
    };

    static getAllCategories = async () => {
        return await prisma.categories.findMany({
            orderBy: { id: 'asc' },
        });
    };

    static getCategory = async (id: Categories['id']) => {
        const category = await prisma.categories.findUnique({
            where: { id },
        });
        if (!category) {
            throw new HttpError('La categoría no existe', 404);
        }
        return category;
    };

    static updateCategory = async (
        id: Categories['id'],
        category: Categories,
    ) => {
        await this.getCategory(id);
        const { name } = category;
        const existsCategory = await prisma.categories.findUnique({
            where: {
                name,
                NOT: { id },
            },
        });
        if (existsCategory) {
            throw new HttpError('Categoría no disponible', 409);
        }
        await prisma.categories.update({
            where: { id },
            data: category,
        });
    };

    static suspendCategory = async (id: Categories['id']) => {
        const category = await this.getCategory(id);
        await prisma.categories.update({
            where: { id },
            data: { status: !category.status },
        });
    };
}
