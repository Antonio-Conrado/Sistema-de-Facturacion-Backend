import { Request, Response } from 'express';
import { catchErrors } from '../config/HttpError';
import { Banks } from '@prisma/client';
import { BankService } from '../services/BankService';

export class BankController {
    static createBank = async (req: Request, res: Response) => {
        const bank: Banks = req.body;
        try {
            await BankService.createBank(bank);
            res.status(200).json('Registro de banco creado con éxito');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getAllBanks = async (req: Request, res: Response) => {
        try {
            const banks = await BankService.getAllBanks();
            res.status(200).json(banks);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static getBank = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const bank = await BankService.getBank(+id);
            res.status(200).json(bank);
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static updateBank = async (req: Request, res: Response) => {
        const { id } = req.params;
        const bank: Banks = req.body;
        try {
            await BankService.updateBank(+id, bank);
            res.status(200).json('Registro de banco actualizado éxitosamente');
        } catch (error) {
            catchErrors(res, error);
        }
    };

    static suspendBank = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const bank = await BankService.suspendBank(+id);
            res.status(200).json(
                `Banco ${bank.status ? 'activado' : 'suspendido'} exitosamente`,
            );
        } catch (error) {
            catchErrors(res, error);
        }
    };
}
