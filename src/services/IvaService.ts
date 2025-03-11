import { prisma } from '../config/db';
import { HttpError } from '../config/HttpError';
import { Iva } from '@prisma/client';

export class IvaService {
    static createIva = async (iva: Iva) => {
        const { rate } = iva;
        const ivaExists = await prisma.iva.findUnique({
            where: { rate },
        });
        if (ivaExists) {
            throw new HttpError('El IVA ya existe', 409);
        }
        await prisma.iva.create({ data: iva });
    };

    static getAllIva = async () => {
        return await prisma.iva.findMany({
            orderBy: { id: 'asc' },
        });
    };

    static getIva = async (id: Iva['id']) => {
        const iva = await prisma.iva.findUnique({
            where: { id },
        });
        if (!iva) {
            throw new HttpError('El IVA no existe', 404);
        }
        return iva;
    };

    static updateIva = async (id: Iva['id'], iva: Iva) => {
        await this.getIva(id);
        const { rate } = iva;
        const existsIva = await prisma.iva.findUnique({
            where: {
                rate,
                NOT: { id },
            },
        });
        if (existsIva) {
            throw new HttpError('IVA no disponible', 409);
        }
        await prisma.iva.update({
            where: { id },
            data: iva,
        });
    };

    static suspendIva = async (id: Iva['id']) => {
        const iva = await this.getIva(id);
        return await prisma.iva.update({
            where: { id },
            data: { status: !iva.status },
        });
    };

    static isIvaSuspended = async (id: Iva['id']) => {
        const supplier = await this.getIva(id);
        if (supplier.status === false) {
            throw new HttpError(`El iva con el id:${id} está suspendido`, 409);
        }
        return supplier;
    };
}
