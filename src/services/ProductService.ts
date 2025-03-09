import { prisma } from '../config/db';
import { StoredProducts } from '../types';

export class ProductService {
    static createProduct = async (dataProduct: StoredProducts) => {
        try {
            return await prisma.$transaction(async (prisma) => {
                const product = await prisma.products.create({
                    data: {
                        code: dataProduct.detailsProducts.products.code,
                        name: dataProduct.detailsProducts.products.name,
                        categoriesId:
                            dataProduct.detailsProducts.products.categoriesId,
                    },
                });

                const detailsProducts = await prisma.detailsProducts.create({
                    data: {
                        productsId: product.id,
                        description: dataProduct.detailsProducts.description,
                    },
                });

                await prisma.storedProducts.create({
                    data: {
                        detailsProductsId: detailsProducts.id,
                        purchasePrice: 0,
                        salePrice: 0,
                        stock: 0,
                    },
                });
                return true;
            });
        } catch (error) {
            return false;
        }
    };

    static updateProduct = async (dataProduct: StoredProducts) => {
        try {
            return await prisma.$transaction(async (prisma) => {
                await prisma.products.update({
                    where: { id: dataProduct.detailsProducts.products.id },
                    data: {
                        code: dataProduct.detailsProducts.products.code,
                        name: dataProduct.detailsProducts.products.name,
                        categoriesId:
                            dataProduct.detailsProducts.products.categoriesId,
                    },
                });

                await prisma.detailsProducts.update({
                    where: { id: dataProduct.detailsProducts.id },
                    data: {
                        description: dataProduct.detailsProducts.description,
                    },
                });

                return true;
            });
        } catch (error) {
            return false;
        }
    };
}
