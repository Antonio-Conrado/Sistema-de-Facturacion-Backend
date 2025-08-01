import nodemailer from 'nodemailer';

const config = () => {
    return {
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            ciphers: 'TLSv1.2,TLSv1.3',
        },
    };
};
export const transport = nodemailer.createTransport(config());
