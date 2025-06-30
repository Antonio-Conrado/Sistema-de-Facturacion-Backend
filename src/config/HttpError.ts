import { Response } from 'express';
export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export const catchErrors = (res: Response, error) => {
    if (error.statusCode === 404) {
        return res.status(404).json({ error: error.message });
    }
    if (error.statusCode === 409) {
        return res.status(409).json({ error: error.message });
    }
    res.status(500).json({
        error: 'Ocurrió un error inesperado. Por favor, intente nuevamente. Si el problema persiste, busque ayuda o consulte con un responsable del sistema.',
    });
};
