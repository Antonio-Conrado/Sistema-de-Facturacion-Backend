import { Request, Response, NextFunction} from 'express'
import formidable from 'formidable'
import cloudinary from '../config/cloudinary'
import { v4 as uuid } from 'uuid';

declare global {
    namespace Express{
        interface Request{
            image : string
        }
    }
}

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({ multiples: false })
    
    try {
        form.parse(req, (error, fields, files) => {
            if(!files.image){
                res.status(400).json({error: 'La imagen es obligatoria'})
                return
            }
            const supporteFormats = ["jpg", "jpeg", "webp", "png", "avif"]
            const fileType = files.image[0].mimetype.split('/')[1]//get format image

            if (!supporteFormats.includes(fileType)) {
                res.status(400).json({ error: 'Formato de imagen no válido. Asegurese que sea las siguientes extensiones: jpg, jpeg, webp, png, avif' })
                return
            }
            if (files.image[0].size > 1048576) {
                res.status(400).json({ error: 'Ha superado el límite de tamaño. Máximo: 1 mega' })
                return
            }

            cloudinary.uploader.upload(files.image[0].filepath, { public_id: uuid() }, async function (error, result) {
                if (error) {
                    res.status(500).json({ error: 'Hubo un error al subir la imagen' })
                    return
                }
                req.image = result.secure_url
                next()
            })
        })
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}