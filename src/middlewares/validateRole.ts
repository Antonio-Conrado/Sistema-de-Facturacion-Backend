import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
export const validateRole = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = await prisma.users.findUnique({
            where: { id: req.user.id },
            include: {
                roles: true,
            },
        });
        if (!roles.includes(user.roles.name)) {
            const error = new Error('Rol no autorizado');
            res.status(401).json({ error: error.message });
            return;
        }
        next();
    };
};
