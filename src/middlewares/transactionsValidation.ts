import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const purchaseValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await Promise.all([
        body('suppliersId')
            .toInt()
            .isInt({ min: 1 })
            .withMessage(
                'El campo proveedor es obligatorio y debe ser un número entero',
            )
            .run(req),

        body('invoiceNumber')
            .toInt()
            .isInt({ min: 1 })
            .withMessage(
                'El campo número de factura es obligatorio y debe ser un número entero',
            )
            .run(req),

        // validation for "detailsPurchases"
        body('detailsPurchases')
            .isArray()
            .withMessage('El campo detalles de compra debe ser un array')
            .run(req),

        body('detailsPurchases.*.storedProductsId')
            .toInt()
            .isInt({ min: 1 })
            .withMessage('El campo del producto debe ser un número entero')
            .run(req),

        body('detailsPurchases.*.amount')
            .toInt()
            .isInt({ min: 1 })
            .withMessage(
                'El campo cantidad debe ser un número entero mayor o igual a 1',
            )
            .run(req),

        body('detailsPurchases.*.purchasePrice')
            .toFloat()
            .isFloat({ min: 1 })
            .withMessage(
                'El campo precio de compra debe ser un número mayor o igual a 1',
            )
            .run(req),

        body('detailsPurchases.*.salePrice')
            .toFloat()
            .isFloat({ min: 1 })
            .withMessage(
                'El campo precio de venta debe ser un número mayor o igual a 1',
            )
            .custom((salePrice, { req, path }) => {
                // Extract the index from the path (example "detailsPurchases.0.salePrice" → 0)
                const match = path.match(/\d+/);
                const index = match ? parseInt(match[0], 10) : null;

                if (index === null) return true;

                const purchasePrice =
                    req.body.detailsPurchases[index]?.purchasePrice ?? null;

                if (purchasePrice === null || salePrice > purchasePrice) {
                    return true;
                }

                throw new Error(
                    `El precio de venta (${salePrice}) debe ser mayor que el precio de compra (${purchasePrice})`,
                );
            })

            .run(req),

        body('detailsPurchases.*.discount')
            .optional()
            .toFloat()
            .isFloat({ min: 0, max: 50 })
            .withMessage(
                'El campo descuento debe tener un rango de 0% - 50% para ser válido',
            )
            .run(req),
    ]);

    next();
};

export const discountValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await body('discount')
        .optional()
        .toFloat()
        .isFloat({ min: 0, max: 50 })
        .withMessage(
            'El campo descuento debe tener un rango de 0% - 50% para ser válido',
        )
        .run(req),
        next();
};

export const ivaValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await body('iva')
        .toInt()
        .isIn([0, 15])
        .withMessage('El campo Iva es obligatorio y debe ser 0% o 15%')
        .run(req),
        next();
};

// sale

export const saleValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await Promise.all([
        body('paymentMethodId')
            .toInt()
            .isInt({ min: 1 })
            .withMessage(
                'El campo método de pago es obligatorio y debe ser un número entero',
            )
            .run(req),

        // validation for "detailsSales"
        body('detailsSales')
            .isArray()
            .withMessage('El campo detalles de venta debe ser un array')
            .run(req),

        body('detailsSales.*.storedProductsId')
            .toInt()
            .isInt({ min: 1 })
            .withMessage('El campo del producto debe ser un número entero')
            .run(req),

        body('detailsSales.*.amount')
            .toInt()
            .isInt({ min: 1 })
            .withMessage(
                'El campo cantidad debe ser un número entero mayor o igual a 1',
            )
            .run(req),

        body('detailsSales.*.price')
            .toFloat()
            .isFloat({ min: 1 })
            .withMessage(
                'El campo precio de venta debe ser un número mayor o igual a 1',
            )

            .run(req),

        body('detailsSales.*.discount')
            .optional()
            .toFloat()
            .isFloat({ min: 0, max: 50 })
            .withMessage(
                'El campo descuento debe tener un rango de 0% - 50% para ser válido',
            )
            .run(req),
    ]);

    next();
};
