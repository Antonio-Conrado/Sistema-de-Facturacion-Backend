import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/db'
import { UserData } from '../types'

declare global {
    namespace Express {
        interface Request {
            user?: UserData
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        const error = new Error('No autorizado. Inicie sesión para poder acceder')
        res.status(401).json({ error: error.message })
        return
    }

    const [, token] = bearer.split(' ')
    if (!token) {
        const error = new Error('Token no válido')
        res.status(401).json({ error: error.message })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (typeof decoded === 'object' && decoded.id) {
            req.user = await prisma.users.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    roleId: true
                }
            })
            next()
        }
    } catch (error) {
        res.status(500).json({ error: 'Token no válido' })
    }
}