import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { ProductService } from '../services/ProductService';
import { catchErrors } from '../config/HttpError';
import { Pagination, StoredProducts } from '../types';

export class ProductsController {
    static getAllProducts = async (req: Request, res: Response) => {
        const { take, skip }: Pagination = req.query;
        try {
            const products = await ProductService.getAllProducts(take, skip);
            res.status(200).json(products);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const product = await ProductService.getProduct(+id);
            res.status(200).json(product);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static createProduct = async (req: Request, res: Response) => {
        const storedProduct: StoredProducts = req.body;
        try {
            await ProductService.createProduct(storedProduct);
            res.status(201).json('Producto creado éxitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static updateProduct = async (req: Request, res: Response) => {
        const storedProduct: StoredProducts = req.body;
        try {
            await ProductService.updateProduct(storedProduct);
            res.status(200).json('Producto actualizado éxitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static suspendProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const product = await ProductService.suspendProduct(+id);
            res.status(200).json(
                `producto ${
                    product.status ? 'activado' : 'suspendido'
                } exitosamente`,
            );
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static uploadImageProduct = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { file: image } = req;
        try {
            await ProductService.uploadImageProduct(+id, image);
            res.status(200).json('Imagen súbida correctamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };
}
