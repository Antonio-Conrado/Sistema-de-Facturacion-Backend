import { Request, Response } from 'express'
import { prisma } from '../config/db'

export class CategoryController {
    static createCategory = async (req: Request, res: Response) => {
        const { name } = req.body
        try {
            const categoryExists = await prisma.categories.findUnique({ where: { name } });
            if (categoryExists) {
                res.status(409).json({ error: "La categoria ya existe" })
                return
            }
            await prisma.categories.create({ data: req.body })

            res.status(200).json( 'Categoría creada con éxito')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await prisma.categories.findMany({
                where: {
                    status: true
                }
            })
            res.status(200).json(categories)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getCategory = async (req: Request, res: Response) => {
        const id = parseInt(req.params.categoryId, 10)
        try {
            const category = await prisma.categories.findUnique({ where: { id } });
            if (!category) {
                res.status(404).json({ error: 'La categoría no existe' })
                return
            }
            res.status(200).json(category)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateCategory = async (req: Request, res: Response) => {
        const id = parseInt(req.params.categoryId, 10)
        try {
            const categoryExists = await prisma.categories.findUnique({
                where: {
                    name: req.body.name,
                    NOT: { id }
                }
            });
            if (categoryExists) {
                res.status(409).json({ error: 'Categoría no disponible' });
                return;
            }

            await prisma.categories.update({
                where: { id },
                data: req.body
            })
            res.status(200).json('Categoría actualizada éxitosamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static suspendedCategory = async (req: Request, res: Response) => {
        const id = parseInt(req.params.categoryId, 10)
        console.log(id)
        try {
            const category = await prisma.categories.findUnique({ where: { id } })
            if (!category) {
                res.status(404).json({ error: 'La categoría no existe' })
                return
            }
            await prisma.categories.update({
                where: { id },
                data: { status: !category.status }
            })

            res.status(200).json('Categoría actualizada éxitosamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

}