import { Request, Response } from 'express'
import { prisma } from '../config/db'

export class SupplierController {
    static createSupplier = async (req: Request, res: Response) => {
        const { ruc, name } = req.body
        try {
            const rucExists = await prisma.suppliers.findUnique({ where: { ruc } });
            const nameExists = await prisma.suppliers.findUnique({ where: { name } });
            if (rucExists || nameExists) {
                res.status(409).json({ error: "El proveedor ya existe" })
                return
            }
            //verify email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (req.body.email && !emailRegex.test(req.body.email)) {
                res.status(409).json({ error: "Email no válido" })
                return
            }

            await prisma.suppliers.create({ data: req.body })
            res.status(200).json('Proveedor creado con éxito')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getAllSuppliers = async (req: Request, res: Response) => {
        try {
            const suppliers = await prisma.suppliers.findMany({
                where: { status: true }
            })
            res.status(200).json(suppliers)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getSupplier = async (req: Request, res: Response) => {
        const id = parseInt(req.params.supplierId, 10)
        try {
            const supplier = await prisma.suppliers.findUnique({ where: { id } });
            if (!supplier) {
                res.status(404).json({ error: 'El proveedor no existe' })
                return
            }
            res.status(200).json(supplier)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateSupplier = async (req: Request, res: Response) => {
        const id = parseInt(req.params.supplierId, 10)
        try {
            const supplierExists = await prisma.suppliers.findUnique({
                where: {
                    name: req.body.name,
                    email: req.body.email,
                    NOT: { id }
                }
            });
            if (supplierExists) {
                res.status(409).json({ error: 'Proveedor no disponible' });
                return;
            }

            await prisma.suppliers.update({
                where: { id },
                data: req.body
            })
            res.status(200).json( 'Proveedor actualizado éxitosamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static suspendedSupplier = async (req: Request, res: Response) => {
        const id = parseInt(req.params.supplierId, 10)
        try {
            const supplier = await prisma.suppliers.findUnique({ where: { id } })
            if (!supplier) {
                res.status(404).json({ error: 'El proveedor no existe' })
                return
            }
            await prisma.suppliers.update({
                where: { id },
                data: { status: !supplier.status }
            })

            res.status(200).json('Proveedor actualizado éxitosamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

}