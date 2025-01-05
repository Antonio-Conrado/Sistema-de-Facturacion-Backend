import { Request, Response, NextFunction } from "express";
type Pagination = {
    page: number
    limit: number
}
declare global {
    namespace Express {
        interface Request {
            pagination?: Pagination
        }
    }
}

export const validatePagination = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string, 10) || 1
    const limit = parseInt(req.query.limit as string, 10) || 12
    
    const pagination: Pagination = {page, limit}
    req.pagination = pagination
    next();
}
