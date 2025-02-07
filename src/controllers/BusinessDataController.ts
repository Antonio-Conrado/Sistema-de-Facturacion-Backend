import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class BusinessDataController {
    static getBusinessData = async (req: Request, res: Response) => {
        try {
            const businessData = await prisma.businessData.findMany();
            if (!businessData) {
                res.status(404).json({
                    error: 'Los datos del negocio no existen',
                });
                return;
            }
            res.status(200).json(businessData[0]);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static updateBusinessData = async (req: Request, res: Response) => {
        try {
            const existingRecord = await prisma.businessData.findFirst();
            if (existingRecord) {
                await prisma.businessData.update({
                    where: { id: existingRecord.id },
                    data: req.body,
                });
                res.status(200).json({
                    msg: 'Datos del negocio actualizados exitosamente',
                });
            } else {
                await prisma.businessData.create({
                    data: req.body,
                });
                res.status(200).json({
                    msg: 'Datos del negocio creados exitosamente',
                });
            }
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static uploadImage = async (req: Request, res: Response) => {
        try {
            const businessData = await prisma.businessData.findFirst();
            if (!businessData) {
                res.status(404).json({
                    error: 'No hay datos disponibles del negocio',
                });
                return;
            }
            const data = await prisma.businessData.update({
                where: { id: businessData.id },
                data: { image: req.image },
            });
            res.status(200).json({ image: data.image });
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
