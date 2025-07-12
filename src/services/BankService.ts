import { prisma } from '../config/db';
import { HttpError } from '../config/HttpError';
import { Banks } from '@prisma/client';

export class BankService {
    static createBank = async (bank: Banks) => {
        const { name } = bank;
        const bankExists = await prisma.banks.findUnique({
            where: { name },
        });
        if (bankExists) {
            throw new HttpError('El banco ya existe', 409);
        }
        await prisma.banks.create({ data: bank });
    };

    static getAllBanks = async () => {
        return await prisma.banks.findMany({
            orderBy: { id: 'asc' },
        });
    };

    static getBank = async (id: Banks['id']) => {
        const bank = await prisma.banks.findUnique({
            where: { id },
        });
        if (!bank) {
            throw new HttpError('El banco no existe', 404);
        }
        return bank;
    };

    static updateBank = async (id: Banks['id'], bank: Banks) => {
        await this.getBank(id);
        const { name } = bank;
        const existsBank = await prisma.banks.findUnique({
            where: {
                name,
                NOT: { id },
            },
        });
        if (existsBank) {
            throw new HttpError('Banco no disponible', 409);
        }
        await prisma.banks.update({
            where: { id },
            data: bank,
        });
    };

    static suspendBank = async (id: Banks['id']) => {
        const bank = await this.getBank(id);
        return await prisma.banks.update({
            where: { id },
            data: { status: !bank.status },
        });
    };

    static isBankSuspended = async (id: Banks['id']) => {
        const bank = await prisma.banks.findUnique({
            where: { id },
        });
        if (!bank) {
            throw new HttpError('El banco no existe', 404);
        }
        if (bank && bank.status === false) {
            throw new HttpError(
                'El banco no está disponible. Intente con otro',
                409,
            );
        }
    };
}
