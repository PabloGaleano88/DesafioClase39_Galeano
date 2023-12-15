import { Router } from 'express'
import passport from 'passport'
import loadUser from '../middlewares/loadUser.js'
import { jwtCurrent, jwtLogin } from '../controllers/sessionController.js'

const sessionRouter = Router()

sessionRouter.post('/login',jwtLogin )

sessionRouter.get('/current', passport.authenticate('jwt',{session:false}),loadUser, jwtCurrent)

export default sessionRouter