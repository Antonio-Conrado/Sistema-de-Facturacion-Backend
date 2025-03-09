import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { ProductService } from '../services/ProductService';

export class ProductsController {
    static getProducts = async (req: Request, res: Response) => {
        try {
            const products = await prisma.storedProducts.findMany({
                include: {
                    detailsProducts: {
                        include: {
                            products: {
                                include: {
                                    categories: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
                orderBy: { id: 'asc' },
            });

            res.status(200).json(products);
        } catch (error) {
            res.status(500).json('Hubo un error');
        }
    };

    static getProduct = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id, 10);
        try {
            const product = await prisma.storedProducts.findFirst({
                where: { id },
                include: {
                    detailsProducts: {
                        include: {
                            products: {
                                include: {
                                    categories: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
                orderBy: { id: 'asc' },
            });

            if (!product) {
                const error = new Error('El producto no ha sído encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json('Hubo un error');
        }
    };

    static createProduct = async (req: Request, res: Response) => {
        try {
            const product = await prisma.products.findUnique({
                where: { code: req.body.detailsProducts.products.code },
            });
            if (product) {
                res.status(404).json({
                    error: `El producto con el código: ${req.body.detailsProducts.products.code} existe`,
                });
                return;
            }

            const categorySuspend = await prisma.categories.findUnique({
                where: { id: +product.categoriesId },
            });
            if (categorySuspend.status === false) {
                const error = new Error(
                    'La categoría no está disponible. Intenta con otra',
                );
                res.status(404).json({ error: error.message });
                return;
            }

            const successCreateProduct = await ProductService.createProduct(
                req.body,
            );
            if (!successCreateProduct) {
                const error = new Error(
                    'El producto no ha sído creado. Intente de nuevo',
                );
                res.status(404).json({ error: error.message });
                return;
            }

            res.status(200).json('Producto creado éxitosamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static updateProduct = async (req: Request, res: Response) => {
        const { id, code } = req.body.detailsProducts.products;
        try {
            const existingProduct = await prisma.products.findUnique({
                where: { code },
            });

            if (existingProduct && existingProduct.id !== id) {
                const error = new Error(
                    `El producto con el código: ${code} ya existe. El código debe ser único.`,
                );
                res.status(400).json({ error: error.message });
                return;
            }

            const successUpdateProduct = await ProductService.updateProduct(
                req.body,
            );
            if (!successUpdateProduct) {
                const error = new Error(
                    'El producto no ha sído actualizado. Intente de nuevo',
                );
                res.status(404).json({ error: error.message });
                return;
            }

            res.status(200).json('Producto actualizado éxitosamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static suspendedProduct = async (req: Request, res: Response) => {
        const id = parseInt(req.params.productId, 10);

        try {
            const product = await prisma.storedProducts.findUnique({
                where: { id },
            });
            if (!product) {
                res.status(404).json({ error: 'El producto no existe' });
                return;
            }
            await prisma.storedProducts.update({
                where: { id },
                data: { status: !product.status },
            });

            res.status(200).json('Producto actualizado éxitosamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static uploadImageProduct = async (req: Request, res: Response) => {
        const id = parseInt(req.params.userId, 10);
        try {
            await prisma.detailsProducts.update({
                where: { id },
                data: { image: req.image },
            });
            res.status(200).json('Imagen súbida correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
