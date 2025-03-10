import { Request, Response } from 'express';
import { SupplierService } from '../services/SupplierService';
import { catchErrors } from '../config/HttpError';
import { Suppliers } from '@prisma/client';

export class SupplierController {
    static createSupplier = async (req: Request, res: Response) => {
        const supplier: Suppliers = req.body;
        try {
            await SupplierService.createSupplier(supplier);
            res.status(200).json('Proveedor creado con éxito');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getAllSuppliers = async (req: Request, res: Response) => {
        try {
            const suppliers = await SupplierService.getAllSuppliers();
            res.status(200).json(suppliers);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getSupplier = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const supplier = await SupplierService.getSupplier(+id);
            res.status(200).json(supplier);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static updateSupplier = async (req: Request, res: Response) => {
        const { id } = req.params;
        const supplier: Suppliers = req.body;
        try {
            await SupplierService.updateSupplier(+id, supplier);
            res.status(200).json('Proveedor actualizado éxitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static suspendSupplier = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await SupplierService.suspendSupplier(+id);
            res.status(200).json('Proveedor suspendido éxitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };
}
