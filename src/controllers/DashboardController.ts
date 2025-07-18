import { Request, Response } from 'express';
import { catchErrors } from '../config/HttpError';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
    static getDashboardSummary = async (req: Request, res: Response) => {
        try {
            const stats = await DashboardService.getDashboardSummary();
            res.status(200).json(stats);
        } catch (error) {
            catchErrors(res, error);
        }
    };
}
