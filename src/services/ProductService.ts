import { DetailsProducts } from '@prisma/client';
import { prisma } from '../config/db';
import { HttpError } from '../config/HttpError';
import {
    OperationType,
    Product,
    StoredProducts,
    updateStockType,
} from '../types';
import { CategoryService } from './CategoryService';

export class ProductService {
    static createProduct = async (storedProduct: StoredProducts) => {
        //Destructuring storedProduct
        const { description } = storedProduct.detailsProducts;
        const { code, name, categoriesId } =
            storedProduct.detailsProducts.products;

        //Validate if the code exists and category is not suspend
        await this.getProductByCode(code);
        await CategoryService.isCategorySuspended(+categoriesId);

        await prisma.storedProducts.create({
            data: {
                purchasePrice: 0,
                salePrice: 0,
                stock: 0,
                detailsProducts: {
                    create: {
                        description,
                        products: {
                            create: {
                                code,
                                name,
                                categoriesId,
                            },
                        },
                    },
                },
            },
        });
    };

    static updateProduct = async (storedProduct: StoredProducts) => {
        //Destructuring storedProduct
        const { id: detailsProductsId, description } =
            storedProduct.detailsProducts;
        const {
            id: productId,
            code,
            name,
            categoriesId,
        } = storedProduct.detailsProducts.products;

        //Validate if the code exists
        await this.getProductByCode(code, productId);

        // Update the product information
        return await prisma.$transaction(async (prisma) => {
            await Promise.all([
                prisma.products.update({
                    where: { id: productId },
                    data: {
                        code,
                        name,
                        categoriesId,
                    },
                }),
                prisma.detailsProducts.update({
                    where: { id: detailsProductsId },
                    data: {
                        description,
                    },
                }),
            ]);
        });
    };

    static getAllProducts = async (take = 10, skip = 0) => {
        return await prisma.storedProducts.findMany({
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
            take,
            skip,
        });
    };

    static getProduct = async (id: StoredProducts['id']) => {
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
            throw new HttpError(
                `El producto con el id: ${id} no ha sído encontrado`,
                404,
            );
        }
        return product;
    };

    static getProductByCode = async (
        code: Product['code'],
        id?: Product['id'],
    ) => {
        const product = await prisma.products.findUnique({
            where: { code },
        });
        const condition = id ? product && product.id !== id : product;
        if (condition) {
            throw new HttpError(
                `El producto con el código: ${code} ya existe. El código debe ser único.`,
                409,
            );
        }
        return product;
    };

    static suspendProduct = async (id: StoredProducts['id']) => {
        const product = await this.getProduct(id);
        return await prisma.storedProducts.update({
            where: { id },
            data: { status: !product.status },
        });
    };

    static uploadImageProduct = async (
        id: DetailsProducts['id'],
        image: DetailsProducts['image'],
    ) => {
        await this.getProduct(id);
        await prisma.detailsProducts.update({
            where: { id },
            data: { image },
        });
    };

    // Define the generic data verification function
    static checkProductsExistsById = async <T>(value: T[]) => {
        // Use Promise.all to wait for all asynchronous operations
        const dataPromises = value.map(async (item) => {
            const productId = (item as any).storedProductsId;

            // Call ProductService.getProduct
            const product = await prisma.storedProducts.findFirst({
                where: { id: productId, status: true },
            });
            if (!product) {
                throw new HttpError(
                    `Producto con el id: ${productId} no existe o está suspendido`,
                    404,
                );
            }
        });

        // Wait for all promises to resolve before continuing
        try {
            await Promise.all(dataPromises);
        } catch (error) {
            throw error;
        }
    };

    static updateStockAndPrices = async (
        value: updateStockType[],
        operationType: OperationType,
    ) => {
        // Get the id and stock of the products sent through the JSON in detailsPurchases
        const storedProducts = await prisma.storedProducts.findMany({
            where: {
                id: {
                    in: value.map((item) => item.storedProductsId),
                },
            },
            select: {
                id: true,
                stock: true,
                purchasePrice: true,
                salePrice: true,
                detailsProducts: {
                    select: {
                        products: {
                            select: {
                                code: true,
                            },
                        },
                    },
                },
            },
        });

        // Update the stock for the ids obtained in the storedProducts variable
        for (const item of value) {
            const storedProduct = storedProducts.find(
                (product) => product.id === item.storedProductsId,
            );

            // Calculate the new stock
            const newStock =
                operationType === 'ADD'
                    ? storedProduct.stock + item.amount
                    : storedProduct.stock - item.amount;

            // If stock is insufficient, throw an error
            if (newStock < 0) {
                throw new HttpError(
                    `Stock insuficiente para el producto con código "${storedProduct.detailsProducts.products.code}". Stock disponible: ${storedProduct.stock}.`,
                    400,
                );
            }
            if (item.purchasePrice <= 0 && item.salePrice <= 0) {
                throw new HttpError(
                    `Precio inválido para el producto con código "${storedProduct.detailsProducts.products.code}". El precio de compra o de venta debe ser mayor a 0.`,
                    400,
                );
            }

            // Update the stock with the new quantity
            await prisma.storedProducts.update({
                where: { id: item.storedProductsId },
                data: {
                    stock: newStock,
                    purchasePrice: item.purchasePrice,
                    salePrice: item.salePrice,
                },
            });
        }
    };

    static filterProductByTerm = async (query: { [key: string]: string }) => {
        console.log(query);
        const results = await prisma.products.findMany({
            include: { detailsProducts: { include: { storedProducts: true } } },
            where: query,
        });
        return results;
    };
}
