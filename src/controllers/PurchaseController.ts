import { Request, Response } from 'express';
import { PurchaseService } from '../services/PurchaseService';
import { catchErrors } from '../config/HttpError';
import { Pagination, Purchase } from '../types';

export class PurchaseController {
    static getAllPurchases = async (req: Request, res: Response) => {
        const { take, skip }: Pagination = req.query;
        try {
            const purchases = await PurchaseService.getAllPurchases(take, skip);
            res.status(200).json(purchases);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getPurchase = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const purchase = await PurchaseService.getPurchase(+id);
            res.status(200).json(purchase);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static createPurchase = async (req: Request, res: Response) => {
        const data: Purchase = req.body;
        const userId = req.user.id;
        try {
            const purchase = await PurchaseService.createPurchase(
                data,
                +userId,
            );
            res.status(201).json(
                `La compra con el número de factura: ${purchase.invoiceNumber} se ha registrado exitosamente`,
            );
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static suspendPurchase = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const purchase = await PurchaseService.suspendPurchase(+id);
            res.status(200).json(
                `La compra con número de factura: ${purchase.invoiceNumber} ha sído anulada exitosamente`,
            );
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static uploadPurchaseInvoice = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { file: document } = req;
        try {
            await PurchaseService.uploadPurchaseInvoice(+id, document);
            res.status(200).json('Archivo subido correctamente');
        } catch (error) {
            console.log(error);
            catchErrors(res, error);
        }
    };

    static filterPurchasesByTerm = async (req: Request, res: Response) => {
        const { take, skip, ...term }: Pagination = req.query;
        try {
            const suppliers = await PurchaseService.getAllPurchases(
                take,
                skip,
                term,
            );
            res.status(200).json(suppliers);
        } catch (error) {
            catchErrors(res, error);
        }
    };
}
