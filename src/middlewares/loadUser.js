import { userModel } from "../dao/MongoDB/models/userModel.js"

const loadUser = async (req,res,next)=>{
    const {userId} =req.user
    const user = await userModel.findById(userId).populate('cartId').lean()
    req.user = user
    next()
}

export default loadUser