import { Request, Response } from 'express';
import { catchErrors } from '../config/HttpError';
import { Pagination, Sale } from '../types';
import { SaleService } from '../services/SaleService';

export class SaleController {
    static getAllSales = async (req: Request, res: Response) => {
        const { take, skip }: Pagination = req.query;
        try {
            const sales = await SaleService.getAllSales(take, skip);
            res.status(200).json(sales);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getSale = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const sale = await SaleService.getSale(+id);
            res.status(200).json(sale);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static lastInvoiceNumber = async (req: Request, res: Response) => {
        try {
            const sale = await SaleService.getLastInvoiceNumber();
            res.status(200).json(sale);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static createSale = async (req: Request, res: Response) => {
        const data: Sale = req.body;
        const userId = req.user.id;

        try {
            const sale = await SaleService.createSale(data, +userId);
            res.status(201).json({
                msg: `La venta con el número de factura: ${sale.invoiceNumber} se ha registrado exitosamente`,
                saleId: sale.id,
            });
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static suspendSale = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { cancellationReason } = req.body;
        try {
            const sale = await SaleService.suspendSale({
                id: +id,
                cancellationReason,
            });
            res.status(200).json(
                `La compra con número de factura: ${sale.invoiceNumber} ha sído anulada exitosamente`,
            );
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static uploadSaleInvoice = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { file: document } = req;
        try {
            await SaleService.uploadSaleInvoice(+id, document);
            res.status(200).json('Archivo subido correctamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static filterSaleByTerm = async (req: Request, res: Response) => {
        const { take, skip, ...term }: Pagination = req.query;
        try {
            const suppliers = await SaleService.getAllSales(take, skip, term);
            res.status(200).json(suppliers);
        } catch (error) {
            catchErrors(res, error);
        }
    };
}
