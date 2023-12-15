import { userModel } from "../dao/MongoDB/models/userModel.js"
import bcrypt from 'bcrypt'
class sessionRepository{

    async findUser(email){
        try{
            const user = await userModel.findOne({ email:email}).lean()
            return user
        }
        catch(error){
            throw error
        }
    } 

    async findUserById(userId){
        try{
            const user = await userModel.findById(userId)
            return user
        }
        catch(error){
            throw error
        }
    } 

    async updatePassword(userId,password){
        try{
            const user = await userModel.findById(userId)
            user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            await user.save()

        }
        catch(error){
            throw error
        }
    } 
}

export default sessionRepository   