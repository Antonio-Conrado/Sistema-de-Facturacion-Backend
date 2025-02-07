import { transport } from "../config/nodemailer"

type EmailType = {
    name: string
    email: string
    token: string
}

export class AuthEmail {
    static sendConfirmatioEmail = async (user: EmailType) => {
        await transport.sendMail({
            from: 'CashTracker <admin@crashtracker.com',
            to: user.email,
            subject: 'crachtracker - confirma tu cuenta',
            html: `
                <p>Hola: ${user.name}, has creado tu cuenta</p>
                <p>Haz click en el siguiente enlace para confirmar tu cuenta </p>
                <a href='${process.env.FRONTEND_URL}/confirmar-cuenta'>Confirmar cuenta</a>
                <p>Ingresa el codigo: <b>${user.token}</b></p>
            `
        })
    }

    static sendPasswordResetToken = async (user: EmailType) => {
        await transport.sendMail({
            from: 'CashTracker <admin@crashtracker.com',
            to: user.email,
            subject: 'crachtracker - restablece tu password',
            html: `
                <p>Hola: ${user.name}, has solicitado restablecer tu cuenta</p>
                <p>Haz click en el siguiente enlace para restablecer tu passwor </p>
                <a href='${process.env.FRONTEND_URL}/resetear-password'>Restablecer password</a>
                <p>Ingresa el codigo: <b>${user.token}</b></p>
            `
        })
    }
}