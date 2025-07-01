import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { seed } from '../data/seed';

export class SeedController {
    static runSeed = async (req: Request, res: Response) => {
        if (process.argv[2] !== '--api') {
            res.status(500).json({
                error: 'Solamente se puede ejecutar el seed en modo --api',
            });
            return;
        }
        try {
            await this.deleteAllDataModels();
            await this.insertNewData();
            res.send('Seed ejecutado correctamente');
        } catch (error) {
            res.json({
                msg: 'Hubo un error al ejecutar el seed',
                error: error,
            });
        }
    };

    private static deleteAllDataModels = async () => {
        const tables = await prisma.$queryRaw<{ tablename: string }[]>`
                SELECT tablename 
                FROM pg_tables 
                WHERE schemaname = 'public'
                AND tablename != '_prisma_migrations'
            `;

        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE ${tables
                .map((table) => `"${table.tablename}"`)
                .join(', ')} RESTART IDENTITY CASCADE;`,
        );
    };

    private static insertNewData = async () => {
        // Recommended order to respect foreign key relationships
        // const insertionOrder = [
        //     'roles',
        //     'users',
        //     'suppliers',
        //     'paymentMethods',
        //     'businessData',
        //     'categories',
        //     'products',
        //     'detailsProducts',
        //     'storedProducts',
        //     'purchases',
        //     'detailsPurchases',
        //     'sales',
        //     'detailsSales',
        // ];

        const models = Object.keys(prisma).filter(
            (key) =>
                typeof prisma[key] === 'object' && 'findMany' in prisma[key],
        );

        const modelsData = Object.keys(seed);

        for (const model of models) {
            if (modelsData.includes(model)) {
                const records = seed[model];
                for (const record of records) {
                    try {
                        await prisma[model].create({
                            data: record,
                        });
                        console.log(`Insertado registro en ${model}`);
                    } catch (error) {
                        console.error(`Error al insertar en ${model}:`, error);
                    }
                }
            }
        }
    };
}
