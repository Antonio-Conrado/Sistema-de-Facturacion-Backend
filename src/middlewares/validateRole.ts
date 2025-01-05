import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
export const validateRole = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = await prisma.users.findUnique({
            where: { id: req.user.id },
            include: {
                roles: true
            }
        })
        if (user.roles.name !== role) {
            const error = new Error('Rol no autorizado')
            res.status(401).json({ error: error.message })
            return
        }
        next()
    }
}
