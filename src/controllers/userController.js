import { recoverModel } from "../dao/MongoDB/models/recoverModel.js"
import sessionRepository from "../repositories/sessionRepository.js"
import { resetPasswordMail } from "../services/mailService.js"
import bcrypt from 'bcrypt'


const SessionRepository = new sessionRepository

export const loginPassport = async (req, res) => {

    req.user.email === "admincoder@coder.com" ? req.session.admin = true : req.session.admin = false
    req.session.first_name = req.user.first_name
    req.session.last_name = req.user.last_name
    req.session.email = req.user.email
    req.session.age = req.user.age
    req.session.cartId = req.user.cartId._id
    req.session.role = req.user.role
    req.session.isLogged = true

    res.redirect('/products')
}

export const registerPassport = async (req, res) => {
    res.redirect('/login')
}

export const logout = async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}

export const githubLogin = async (req, res) => {
    req.user.email === "admincoder@coder.com" ? req.session.admin = true : req.session.admin = false
    req.session.first_name = req.user.first_name
    req.session.last_name = req.user.last_name
    req.session.email = req.user.email
    req.session.age = req.user.age
    req.session.cart = req.user.cartId
    req.session.cartId = req.user.cartId._id
    req.session.isLogged = true

    res.redirect('/products')
}

export const passResetReq = async (req, res) => {
    try {
        const { email } = req.body
        resetPasswordMail(email)
    }
    catch (error) {
        throw error
    }

}

export const passReset = async (req, res) => {
    try {
        const recoverId = req.params.rid
        const { password } = req.body
        const recover = await recoverModel.findOne({ _id: recoverId })
        const user = await SessionRepository.findUserById(recover.userId)
        if (bcrypt.compareSync(password, user.password)) {
            res.redirect('/changepasserror')

        }
        if (recover.expired_at.getTime() <= actualDate.getTime()) {
            res.redirect('/changepasserror')
        }

        await SessionRepository.updatePassword(recover.userId,password)
        res.redirect('/login')
    }
    catch (error) {

    }
}

//el cambio de rol se hace con thunderclient
export const changeRole = async (req,res) =>{
    const uid = req.params.uid
    try{
        const user = await SessionRepository.findUserById(uid)
        console.log(user.role)
        user.role === "premium" ? user.role = "user" : user.role = "premium"
        await user.save()
        res.status(200).send(`el usuario cambió su rol a: ${user.role}`)
    }
    catch(error){
        res.status(400).send("error al cambiar el rol del usuario")
        throw error

    }
}