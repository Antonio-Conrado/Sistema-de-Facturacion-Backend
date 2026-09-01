import nodemailer from 'nodemailer';

const config = () => {
    console.log('EMAIL_HOST at load time:', process.env.EMAIL_HOST);
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
let _transport: nodemailer.Transporter | null = null;

export const getTransport = () => {
    if (!_transport) {
        _transport = nodemailer.createTransport(config());
    }
    return _transport;
};
