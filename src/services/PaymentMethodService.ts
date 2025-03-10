import { prisma } from '../config/db';
import { HttpError } from '../config/HttpError';
import { PaymentMethods } from '@prisma/client';

export class PaymentMethodService {
    static createPaymentMethod = async (paymentMethod: PaymentMethods) => {
        const { name } = paymentMethod;
        const paymentMethodExists = await prisma.paymentMethods.findUnique({
            where: { name },
        });
        if (paymentMethodExists) {
            throw new HttpError('El método de pago ya existe', 409);
        }
        await prisma.paymentMethods.create({ data: paymentMethod });
    };

    static getAllPaymentMethods = async () => {
        return await prisma.paymentMethods.findMany({
            orderBy: { id: 'asc' },
        });
    };

    static getPaymentMethod = async (id: PaymentMethods['id']) => {
        const paymentMethod = await prisma.paymentMethods.findUnique({
            where: { id },
        });
        if (!paymentMethod) {
            throw new HttpError('El método de pago no existe', 404);
        }
        return paymentMethod;
    };

    static updatePaymentMethod = async (
        id: PaymentMethods['id'],
        paymentMethod: PaymentMethods,
    ) => {
        await this.getPaymentMethod(id);
        const { name } = paymentMethod;
        const existsPaymentMethods = await prisma.paymentMethods.findUnique({
            where: {
                name,
                NOT: { id },
            },
        });
        if (existsPaymentMethods) {
            throw new HttpError('Método de pago no disponible', 409);
        }
        await prisma.paymentMethods.update({
            where: { id },
            data: paymentMethod,
        });
    };

    static suspendPaymentMethod = async (id: PaymentMethods['id']) => {
        const paymentMethod = await this.getPaymentMethod(id);
        return await prisma.paymentMethods.update({
            where: { id },
            data: { status: !paymentMethod.status },
        });
    };
}
