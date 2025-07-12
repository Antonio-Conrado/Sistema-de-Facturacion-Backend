import { Sales } from '@prisma/client';
import { prisma } from '../config/db';
import { Sale, SuspendSaleType, User } from '../types';
import { HttpError } from '../config/HttpError';
import {
    calculateDetailSubtotal,
    calculateTotalFromDetails,
} from '../utils/calculateTransactionsTotal';
import { ProductService } from './ProductService';
import { PaymentMethods } from '../data/data';
import { BankService } from './BankService';

export class SaleService {
    static createSale = async (sale: Sale, userId: User['id']) => {
        const lastInvoiceNumber = await this.getLastInvoiceNumber();
        // Check if the suppliers and products exist and status is true
        // await ProductService.checkProductsExistsById(sale.detailsSales); //

        // Check if the payment method is bank transfer and if the bank is suspended
        if (sale.paymentMethodId === 2 && !sale.bankId) {
            throw new HttpError(
                'La venta no puede ser registrada porque el método de pago es Transferencia Bancaria pero no se ha proporcionado un banco.',
                400,
            );
        }
        await BankService.isBankSuspended(sale.bankId);

        // Evaluate the total of the purchase transactions
        const evaluatedTotal = calculateTotalFromDetails(
            sale.detailsSales,
            sale.iva === 15 ? sale.iva : 0,
            sale.discount,
        );

        //Insert the data into the database table
        return await prisma.$transaction(async (prisma) => {
            await ProductService.updateStockAndPrices(
                sale.detailsSales,
                'SUBTRACT',
            );

            return await prisma.sales.create({
                data: {
                    usersId: userId,
                    paymentMethodId: sale.paymentMethodId,
                    bankId:
                        sale.bankId && sale.paymentMethodId === 2
                            ? sale.bankId
                            : null,
                    iva: sale.iva,
                    invoiceNumber: lastInvoiceNumber,
                    date: sale.date ?? new Date(),
                    transactionReference:
                        sale.paymentMethodId === 2
                            ? sale.transactionReference
                            : null,
                    subtotal: evaluatedTotal.subtotal,
                    discount: sale.discount,
                    total: evaluatedTotal.totalValue,
                    detailsSales: {
                        create: sale.detailsSales.map((detail) => ({
                            storedProductsId: detail.storedProductsId,
                            amount: detail.amount,
                            price: detail.price,
                            discount: detail.discount,
                            subtotal: calculateDetailSubtotal({
                                price: detail.price,
                                amount: detail.amount,
                                discount: detail.discount,
                            }).subtotalValue,
                        })),
                    },
                },
            });
        });
    };

    static getAllSales = async <T>(take = 10, skip = 0, term?: T) => {
        const query = term ? { where: term } : undefined;
        const [sales, total] = await Promise.all([
            prisma.sales.findMany({
                omit: {
                    transactionReference: true,
                    paymentMethodId: true,
                    usersId: true,
                },
                include: {
                    users: {
                        select: {
                            name: true,
                            surname: true,
                        },
                    },
                    paymentMethods: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: { id: 'desc' },
                take,
                skip,
                ...query,
            }),
            prisma.sales.count({ ...query }),
        ]);
        return { sales, total };
    };

    static getSale = async (id: Sales['id']) => {
        const sale = await prisma.sales.findUnique({
            where: { id },
            include: {
                users: { select: { name: true, surname: true } },
                paymentMethods: { select: { name: true } },
                detailsSales: {
                    include: {
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

        if (!sale) {
            throw new HttpError(`La venta solicitada no existe`, 404);
        }
        return sale;
    };

    static suspendSale = async ({
        id,
        cancellationReason,
    }: SuspendSaleType) => {
        await this.getSale(id);
        return await prisma.sales.update({
            where: { id },
            data: { status: false, cancellationReason, annulledAt: new Date() },
        });
    };

    static uploadSaleInvoice = async (
        id: Sales['id'],
        document: Sales['document'],
    ) => {
        const sale = await this.getSale(id);
        if (sale.paymentMethods.name === PaymentMethods.bankTransfer) {
            return await prisma.sales.update({
                where: { id },
                data: { document },
            });
        }
        throw new HttpError(
            `No se puede subir el comprobante: la venta con número de factura ${sale.invoiceNumber} no utiliza el método de pago "Transferencia Bancaria".`,
            400,
        );
    };

    static getLastInvoiceNumber = async () => {
        const sale = await prisma.sales.findFirst({
            orderBy: { invoiceNumber: 'desc' },
        });
        if (!sale.invoiceNumber) {
            return 1;
        }
        return sale.invoiceNumber + 1;
    };
}
