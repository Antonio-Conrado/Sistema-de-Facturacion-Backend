import { prisma } from './../config/db';
import { Purchase, User } from '../types';
import { SupplierService } from './SupplierService';
import { IvaService } from './IvaService';
import { HttpError } from '../config/HttpError';
import {
    calculateDetailSubtotal,
    calculateTotalFromDetails,
} from '../utils/calculateTransactionsTotal';
import { ProductService } from './ProductService';

export class PurchaseService {
    static createProduct = async (purchase: Purchase, userId: User['id']) => {
        // Check if the supplier, IVA and products exist and status is true
        await ProductService.checkProductsExistsById(purchase.detailsPurchases); //Validate that each product exists in detailsPurchases.

        await SupplierService.isSupplierSuspended(+purchase.suppliersId);
        const iva = await IvaService.isIvaSuspended(+purchase.ivaId);

        // Evaluate the total of the purchase transactions
        const evaluatedTotal = calculateTotalFromDetails(
            purchase.detailsPurchases,
            iva,
            purchase.discount,
        );

        // Get the last invoice number
        const lastPurchase = await prisma.purchases.findFirst({
            select: { invoiceNumber: true },
            orderBy: { invoiceNumber: 'desc' },
        });

        const invoiceNumber = lastPurchase?.invoiceNumber ?? 0;

        //Insert the data into the database table
        return await prisma.$transaction(async (prisma) => {
            await ProductService.updateStock(
                purchase.detailsPurchases,
                'SUBTRACT',
            );

            return await prisma.purchases.create({
                data: {
                    usersId: userId,
                    suppliersId: purchase.suppliersId,
                    ivaId: purchase.ivaId,
                    invoiceNumber: invoiceNumber + 1,
                    document: purchase.document,
                    date: purchase.date,
                    subtotal: evaluatedTotal.subtotalValue,
                    discount: purchase.discount,
                    total: evaluatedTotal.totalValue,
                    detailsPurchases: {
                        create: purchase.detailsPurchases.map((detail) => ({
                            storedProductsId: detail.storedProductsId,
                            amount: detail.amount,
                            purchasePrice: detail.purchasePrice,
                            salePrice: detail.salePrice,
                            discount: detail.discount,
                            subtotal: calculateDetailSubtotal({
                                price: detail.purchasePrice,
                                amount: detail.amount,
                                discount: detail.discount,
                            }).subtotalValue,
                        })),
                    },
                },
            });
        });
    };

    static getAllPurchases = async <T>(take = 10, skip = 0, term?: T) => {
        const query = term ? { where: term } : undefined;
        const [purchases, total] = await Promise.all([
            prisma.purchases.findMany({
                select: {
                    id: true,
                    users: { select: { id: true, name: true, surname: true } },
                    suppliers: { select: { id: true, name: true } },
                    iva: { select: { rate: true } },
                    invoiceNumber: true,
                    document: true,
                    date: true,
                    total: true,
                    discount: true,
                    status: true,
                },
                orderBy: { invoiceNumber: 'asc' },
                take,
                skip,
                ...query,
            }),
            prisma.purchases.count({ ...query }),
        ]);
        return { purchases, total };
    };

    static getPurchase = async (id: Purchase['id']) => {
        const purchase = await prisma.purchases.findUnique({
            where: { id },
            include: {
                users: { select: { name: true, surname: true } },
                suppliers: { select: { name: true } },
                iva: { select: { rate: true } },
                detailsPurchases: {
                    select: {
                        id: true,
                        purchasesId: true,
                        amount: true,
                        purchasePrice: true,
                        salePrice: true,
                        discount: true,
                        subtotal: true,
                        storedProducts: {
                            select: {
                                detailsProducts: {
                                    select: {
                                        image: true,
                                        products: {
                                            select: {
                                                name: true,
                                                code: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!purchase) {
            throw new HttpError(`La compra solicitada no existe`, 404);
        }
        return purchase;
    };

    static suspendPurchase = async (id: Purchase['id']) => {
        await this.getPurchase(id);
        return await prisma.purchases.update({
            where: { id },
            data: { status: false },
        });
    };

    static uploadPurchaseInvoice = async (
        id: Purchase['id'],
        document: Purchase['document'],
    ) => {
        await this.getPurchase(id);
        await prisma.purchases.update({
            where: { id },
            data: { document },
        });
    };
}
