import { exit } from 'node:process';
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const testConnectionDB = async () => {
    try {
        await prisma.$connect();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.log('Error en la conexión de la base de datos:', error);
        exit()
    }

};
export default testConnectionDB