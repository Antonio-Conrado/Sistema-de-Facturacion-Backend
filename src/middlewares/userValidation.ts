import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { param, validationResult } from "express-validator";
import { UserData } from "../types";

declare global {
    namespace Express {
        interface Request {
            user?: UserData
        }
    }
}

export const validateUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.userId, 10);
        const user = await prisma.users.findUnique({ where: { id } })
        if (!user) {
            res.status(404).json({ error: 'El usuario no existe' })
            return
        }
        req.user = user
        next();
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export const validateUserId = async (req: Request, res: Response, next: NextFunction) => {
    await param('userId')
        .custom(value => value > 0).withMessage('El id del usuario no es válido').run(req)

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }
    next();
}

