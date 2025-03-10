import { prisma } from '../config/db';
import { HttpError } from '../config/HttpError';
import { Suppliers } from '@prisma/client';

export class SupplierService {
    static createSupplier = async (supplier: Suppliers) => {
        const { ruc, name } = supplier;
        const rucExists = await prisma.suppliers.findUnique({
            where: { ruc },
        });
        const nameExists = await prisma.suppliers.findUnique({
            where: { name },
        });
        if (rucExists || nameExists) {
            throw new HttpError('El proveedor ya existe', 409);
        }
        //verify email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (supplier.email && !emailRegex.test(supplier.email)) {
            throw new HttpError('Email no válido', 409);
        }

        await prisma.suppliers.create({ data: supplier });
    };

    static getAllSuppliers = async () => {
        return await prisma.suppliers.findMany({
            orderBy: { id: 'asc' },
        });
    };

    static getSupplier = async (id: Suppliers['id']) => {
        const supplier = await prisma.suppliers.findUnique({
            where: { id },
        });
        if (!supplier) {
            throw new HttpError('El proveedor no existe', 404);
        }

        return supplier;
    };

    static updateSupplier = async (
        id: Suppliers['id'],
        supplier: Suppliers,
    ) => {
        await this.getSupplier(id);
        const { name, ruc, email } = supplier;
        const supplierExists = await prisma.suppliers.findUnique({
            where: {
                ruc,
                name,
                email,
                NOT: { id },
            },
        });
        if (supplierExists) {
            throw new HttpError('Proveedor no disponible', 409);
        }
        await prisma.suppliers.update({
            where: { id },
            data: supplier,
        });
    };

    static suspendSupplier = async (id: Suppliers['id']) => {
        const supplier = await this.getSupplier(id);
        return await prisma.suppliers.update({
            where: { id },
            data: { status: !supplier.status },
        });
    };
}
