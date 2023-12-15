import nodemailer from 'nodemailer'
import { recoverModel } from '../dao/MongoDB/models/recoverModel.js'
import sessionRepository from '../repositories/sessionRepository.js'

const SessionRepository = new sessionRepository

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    }
})

export const sendMail = async (userEmail, autoCode, amountTotal) => {
    try {
        await mailTransport.sendMail({
            from: `e-Commerce CoderHouse <${process.env.MAIL_ADDRESS}>`,
            to: userEmail,
            subject: 'e-Commecer Coder comprobante de compra',
            html:
                `<div>
            <h1>Gracias por tu compra!</h1>
            <h2> A continuación verás los detalles de tu compra:</h2>
            <div>
            <h3>Código de compra: ${autoCode}</h3>
            <h3>Total de la compra: U$D ${amountTotal}</h3>
            <h3>Comprador: ${userEmail}</h3>
            
            </div>
            </div>
            `
        })
    }
    catch (error) {
        throw error
    }
}

export const resetPasswordMail = async (userEmail) => {
    try {
        const mail = userEmail.toLowerCase()
        const user = await SessionRepository.findUser(mail)
        const actualDate = new Date()
        const recover = await recoverModel.create({
            userId: user._id,
            expired_at: new Date(actualDate.getTime() + 60 * 60000)
        })
        await mailTransport.sendMail({
            from: `e-Commerce CoderHouse <${process.env.MAIL_ADDRESS}>`,
            to: userEmail,
            subject: 'Recuperar contraseña',
            html:
                `<div>
            <h1>E-mail de recuperación de contraseña</h1>
            <h2>Ingresa al siguiente Link para recuperar tu password: <a href="http://localhost:8080/changepassword/${recover._id}">Resetear Password</a> </h2>
            <div>
            <h3>Si tu no has pedido recuperar tu contraseña ignora este e-mail</h3>
            </div>
            </div>
            `
        })
    }
    catch (error) {
        throw error
    }
} 