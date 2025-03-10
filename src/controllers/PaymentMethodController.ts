import { Request, Response } from 'express';
import { catchErrors } from '../config/HttpError';
import { PaymentMethods } from '@prisma/client';
import { PaymentMethodService } from '../services/PaymentMethodService';

export class PaymentMethodController {
    static createPaymentMethod = async (req: Request, res: Response) => {
        const paymentMethod: PaymentMethods = req.body;
        try {
            await PaymentMethodService.createPaymentMethod(paymentMethod);
            res.status(200).json('Método de pago creado con éxito');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getAllPaymentMethods = async (req: Request, res: Response) => {
        try {
            const paymentMethod =
                await PaymentMethodService.getAllPaymentMethods();
            res.status(200).json(paymentMethod);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getPaymentMethod = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const paymentMethod = await PaymentMethodService.getPaymentMethod(
                +id,
            );
            res.status(200).json(paymentMethod);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static updatePaymentMethod = async (req: Request, res: Response) => {
        const { id } = req.params;
        const paymentMethod: PaymentMethods = req.body;
        try {
            await PaymentMethodService.updatePaymentMethod(+id, paymentMethod);
            res.status(200).json('Método de pago actualizado exitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static suspendPaymentMethod = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const paymentMethod =
                await PaymentMethodService.suspendPaymentMethod(+id);
            res.status(200).json(
                `Método de pago ${
                    paymentMethod.status ? 'activado' : 'suspendido'
                } exitosamente`,
            );
        } catch (error) {
            catchErrors(res, error);
        }
    };
}
