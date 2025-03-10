import { Request, Response } from 'express';
import { catchErrors } from '../config/HttpError';
import { IvaService } from '../services/IvaService';
import { Iva } from '@prisma/client';

export class IvaController {
    static createIva = async (req: Request, res: Response) => {
        const iva: Iva = req.body;
        try {
            await IvaService.createIva(iva);
            res.status(200).json('Iva creado con éxito');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getAllIva = async (req: Request, res: Response) => {
        try {
            const iva = await IvaService.getAllIva();
            res.status(200).json(iva);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getIva = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const iva = await IvaService.getIva(+id);
            res.status(200).json(iva);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static updateIva = async (req: Request, res: Response) => {
        const { id } = req.params;
        const iva: Iva = req.body;
        try {
            await IvaService.updateIva(+id, iva);
            res.status(200).json('IVA actualizado exitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static suspendIva = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await IvaService.suspendIva(+id);
            res.status(200).json('IVA actualizado exitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };
}
