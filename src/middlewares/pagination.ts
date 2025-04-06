import { Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
type Pagination = {
    page: number;
    limit: number;
};
declare global {
    namespace Express {
        interface Request {
            pagination?: Pagination;
        }
    }
}

export const validatePagination = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;

    const pagination: Pagination = { page, limit };
    req.pagination = pagination;
    next();
};

export const validatePaginationQuery = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await query('take')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El límite de datos por página debe ser un número entero')
        .run(req);

    await query('skip')
        .optional()
        .toInt()
        .isInt()
        .withMessage('El salto de datos por página debe ser un número entero')
        .run(req);

    next();
};
