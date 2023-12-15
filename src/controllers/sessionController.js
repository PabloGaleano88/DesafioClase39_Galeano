import sessionRepository from '../repositories/sessionRepository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { currentSessionDTO } from '../dao/currentSessionDTO.js'

const SessionRepository = new sessionRepository

export const jwtLogin = async (req, res) => {
    const { email, password } = req.body
    const email_to_lowercase = email.toLowerCase()
    const user = await SessionRepository.findUser(email_to_lowercase)

    if (!user) {
        return res.redirect('/login?login_fail=true')
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send("password incorrecto")
    }

    const userId = user._id
    const token = jwt.sign({ userId }, process.env.PASSPORT_JWT_SECRETORKEY, { expiresIn: '24h' })

    res.cookie(process.env.COOKIE_TOKEN, token, {
        maxAge : 1000000,
        httpOnly: true,
    }).send(`estas logeado, prueba ingresando a http://localhost:8080/api/session/current para ver la información de tu token en las cookies`)

}

export const jwtCurrent = async(req,res)=>{
    const currentSession = currentSessionDTO(req.user)
    res.send(currentSession)
}