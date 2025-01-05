import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class IvaController {
    static createIva = async (req: Request, res: Response) => {
        const {rate} = req.body
        try {
            const ivaExists = await prisma.iva.findUnique({
                where: { rate }
            });
            if (ivaExists) {
                res.status(409).json({ error: "El iva ya existe" })
                return
            }
            await prisma.iva.create({ data: req.body })
            res.status(200).json({ msg: 'Iva creado con éxito' })
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static getAllIva = async (req: Request, res: Response) => {
        try {
            const ivaList = await prisma.iva.findMany({
                where: {
                    status: true
                }
            })
            res.status(200).json({ data: ivaList });
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static getIva = async (req: Request, res: Response) => {
        const id = parseInt(req.params.ivaId, 10)
        try {
            const iva = await prisma.iva.findUnique({
                where: { id }
            });
            if (!iva) {
                res.status(404).json({ error: 'IVA no encontrado' })
                return
            }
            res.status(200).json(iva);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static updateIva = async (req: Request, res: Response) => {
        const id = parseInt(req.params.ivaId, 10)
        const { rate } = req.body;
        try {
            const iva = await prisma.iva.findUnique({
                where: { id },
            });
            if (!iva) {
                res.status(404).json({ error: 'IVA no encontrado' })
                return
            }

            await prisma.iva.update({
                where: { id },
                data: { rate: parseFloat(rate) },
            });
            res.status(200).json({ msg: 'IVA actualizado exitosamente' })
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static suspendedIva = async (req: Request, res: Response) => {
        const id = parseInt(req.params.ivaId, 10)
        try {
            const iva = await prisma.iva.findUnique({
                where: { id },
            });
            if (!iva) {
                res.status(404).json({ error: 'IVA no encontrado' });
                return
            }
            await prisma.iva.update({
                where: { id },
                data: { status: !iva.status }
            });
            res.status(200).json({ msg: 'IVA actualizado exitosamente' })
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}

