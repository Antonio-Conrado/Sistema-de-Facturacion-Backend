import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateJWT } from '../utils/generateJWT';
import { generateToken } from '../utils/token';
import { User } from '../types';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const userExists = await prisma.users.findUnique({
                where: { email },
            });
            if (userExists) {
                res.status(409).json({ error: 'El usuario ya existe' });
                return;
            }
            // Assign roleId: 1 (admin) if no user exists in the database, otherwise 2 (regular user)
            const user: User = req.body;
            const userRole = await prisma.users.findFirst();

            user.roleId = userRole ? 2 : 1;
            user.password = await hashPassword(req.body.password);
            user.token = generateToken();
            user.isConfirm = false;
            await prisma.users.create({ data: user });

            await AuthEmail.sendConfirmatioEmail({
                name: user.name,
                email: user.email,
                token: user.token,
            });

            res.status(201).json('Revisa tu correo para confirmar tu cuenta');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static confirmAccount = async (req: Request, res: Response) => {
        const token: string = req.body.token;
        try {
            const user = await prisma.users.findUnique({ where: { token } });
            if (!user) {
                res.status(403).json({ error: 'Token no válido' });
                return;
            }
            user.isConfirm = true;
            user.token = null;
            await prisma.users.update({ where: { token }, data: user });
            res.send('Usuario confimado correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static login = async (req: Request, res: Response) => {
        try {
            const user = await prisma.users.findUnique({
                where: { email: req.body.email },
            });
            if (!user || user.status === false) {
                res.status(404).json({
                    error: 'El usuario no existe o está dado de baja',
                });
                return;
            }
            if (user.isConfirm === false) {
                res.status(404).json({
                    error: 'El usuario no ha sído confirmado',
                });
                return;
            }

            const password = await checkPassword(
                req.body.password,
                user.password,
            );
            if (!password) {
                res.status(403).json({ error: 'El password es incorrecto' });
                return;
            }
            const data = generateJWT({
                id: user.id,
                roleId: user.roleId,
            });

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const user = await prisma.users.findUnique({ where: { email } });
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }
            if (!user.isConfirm) {
                res.status(404).json({
                    error: 'La cuenta no ha sído confirmada',
                });
                return;
            }
            user.token = generateToken();
            await prisma.users.update({ where: { email }, data: user });
            await AuthEmail.sendPasswordResetToken({
                name: user.name,
                email: user.email,
                token: user.token,
            });

            res.status(200).send(
                'Revisa tu email para restablecer tu password',
            );
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static validateToken = async (req: Request, res: Response) => {
        const { token } = req.body;
        try {
            const tokenExists = await prisma.users.findUnique({
                where: { token },
            });
            if (!tokenExists) {
                const error = new Error('Token no válido');
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(200).send('Token válido');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static resetPasswordByToken = async (req: Request, res: Response) => {
        const { token } = req.body;
        try {
            const user = await prisma.users.findUnique({ where: { token } });
            if (!user) {
                res.status(404).json({ error: 'El usuario no existe' });
                return;
            }

            const newPassword = await hashPassword(req.body.password);
            await prisma.users.update({
                where: { id: user.id },
                data: { password: newPassword, token: null },
            });
            res.status(200).json('Password actualizado correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static user = async (req: Request, res: Response) => {
        res.status(200).json(req.user);
    };

    static updatePassword = async (req: Request, res: Response) => {
        const { password } = req.body;
        const id = parseInt(req.params.userId, 10);
        try {
            const user = await prisma.users.findUnique({ where: { id } });
            if (user.roleId === 1 && req.user.roleId === 2) {
                const error = new Error(
                    'No está autorizado para realizar esta acción',
                );
                res.status(401).json({ error: error.message });
                return;
            }
            const isPasswordCorrect = await checkPassword(
                password,
                user.password,
            );
            if (!isPasswordCorrect) {
                const error = new Error('El password actual es incorrecto');
                res.status(409).json({ error: error.message });
                return;
            }

            const newPassword = await hashPassword(req.body.newPassword);
            await prisma.users.update({
                where: { id },
                data: { password: newPassword },
            });
            res.status(200).send('El password se actualizó correctamente');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body;
        const { id } = req.user;
        try {
            const user = await prisma.users.findUnique({ where: { id } });
            const isPasswordCorrect = await checkPassword(
                password,
                user.password,
            );
            if (!isPasswordCorrect) {
                const error = new Error('El password actual es incorrecto');
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(200).send('El password es correcto');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };

    static getRoles = async (req: Request, res: Response) => {
        try {
            const roles = await prisma.roles.findMany();
            if (!roles) {
                const error = new Error('No hay roles disponibles');
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(200).send(roles);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
