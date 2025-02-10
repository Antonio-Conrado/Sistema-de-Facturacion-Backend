import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { v4 as uuid } from 'uuid';
import formidable from 'formidable';
import { prisma } from '../config/db';
import { User } from '../types';
import { hashPassword } from '../utils/auth';

export class UserController {
    static createUser = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const userExists = await prisma.users.findUnique({
                where: { email },
            });
            if (userExists) {
                res.status(409).json({ error: 'El usuario ya existe' });
                return;
            }
            const user: User = req.body;
            user.password = await hashPassword(req.body.password);
            user.isConfirm = true;
            await prisma.users.create({ data: user });

            res.status(200).json('Usuario creado con éxito');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await prisma.users.findMany({
                where: {
                    isConfirm: true,
                },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    email: true,
                    roles: {
                        select: { name: true },
                    },
                },
            });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static getUser = async (req: Request, res: Response) => {
        const id = parseInt(req.params.userId, 10);
        try {
            const user = await prisma.users.findUnique({
                where: { id },
                select: {
                    id: true,
                    image: true,
                    name: true,
                    surname: true,
                    roleId: true,
                    email: true,
                    telephone: true,
                    roles: {
                        select: { name: true },
                    },
                },
            });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static updateUser = async (req: Request, res: Response) => {
        const id = parseInt(req.params.userId, 10);
        try {
            const userExists = await prisma.users.findFirst({
                where: {
                    email: req.body.email,
                    NOT: { id },
                },
            });
            if (userExists) {
                res.status(409).json({ error: 'Email no disponible' });
                return;
            }

            req.body.password = await hashPassword(req.body.password);
            await prisma.users.update({
                where: { id },
                data: req.body,
            });
            res.status(200).json('Usuario actualizado éxitosamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static suspendUser = async (req: Request, res: Response) => {
        const id = parseInt(req.params.userId, 10);
        try {
            await prisma.users.update({
                where: { id },
                data: { status: !req.user.status },
            });

            res.status(200).json( 'Usuario actualizado éxitosamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static uploadImageUser = async (req: Request, res: Response) => {
        const id = parseInt(req.params.userId, 10);
        try {
            const user = await prisma.users.update({
                where: { id },
                data: { image: req.image },
            });
            res.status(200).json('Imagen súbida correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
