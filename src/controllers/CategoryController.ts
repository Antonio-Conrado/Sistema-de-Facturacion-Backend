import { Request, Response } from 'express';
import { catchErrors } from '../config/HttpError';
import { Categories } from '@prisma/client';
import { CategoryService } from '../services/CategoryService';

export class CategoryController {
    static createCategory = async (req: Request, res: Response) => {
        const category: Categories = req.body;
        try {
            await CategoryService.createCategory(category);
            res.status(200).json('Categoría creada con éxito');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getCategory = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const category = await CategoryService.getCategory(+id);
            res.status(200).json(category);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static updateCategory = async (req: Request, res: Response) => {
        const { id } = req.params;
        const category: Categories = req.body;
        try {
            await CategoryService.updateCategory(+id, category);
            res.status(200).json('Categoría actualizada éxitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static suspendCategory = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const category = await CategoryService.suspendCategory(+id);
            res.status(200).json(
                `categoría ${
                    category.status ? 'activada' : 'suspendida'
                } exitosamente`,
            );
            res.status(200).json('Categoría suspendido éxitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };
}
