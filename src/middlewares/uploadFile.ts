import { Request, Response, NextFunction } from 'express';
import formidable from 'formidable';
import cloudinary from '../config/cloudinary';
import { v4 as uuid } from 'uuid';

declare global {
    namespace Express {
        interface Request {
            file: string;
        }
    }
}

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const form = formidable({ multiples: false });

    try {
        form.parse(req, (error, fields, files) => {
            if (!files.file && !files.image) {
                res.status(400).json({ error: 'El archivo es obligatorio' });
                return;
            }
            const file = files.file ? files.file : files.image;
            const supporteFormatsImage = ['jpg', 'jpeg', 'webp', 'png', 'avif'];
            const supporteFormatsFile = ['pdf', 'word'];
            const fileType = file[0].mimetype.split('/')[1]; //get format file

            if (files.file && !supporteFormatsFile.includes(fileType)) {
                res.status(400).json({
                    error: 'Formato de archivo no válido. Asegurese que sea las siguientes extensiones: pdf o docx',
                });
                return;
            }

            if (files.image && !supporteFormatsImage.includes(fileType)) {
                res.status(400).json({
                    error: 'Formato de imagen no válido. Asegurese que sea las siguientes extensiones: jpg, jpeg, webp, png o avif',
                });
                return;
            }

            if (file[0].size > 3145728) {
                res.status(400).json({
                    error: 'Ha superado el límite de tamaño. Máximo: 3 megas',
                });
                return;
            }

            cloudinary.uploader.upload(
                file[0].filepath,
                { public_id: uuid() },
                async function (error, result) {
                    if (error) {
                        res.status(500).json({
                            error: 'Hubo un error al subir el archivo. Intente nuevamente o más tarde',
                        });
                        return;
                    }
                    req.file = result.secure_url;
                    next();
                },
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
};
