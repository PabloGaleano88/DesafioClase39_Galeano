import MockingRepository from "../repositories/mockingRepository.js"
import { logger } from "../utils/logger.js"

const mockingRepository = new MockingRepository

export const getMockingProducts = async(req,res) => {
    try{
        let products=[]
        for(let i=0; i<100;i++){
            let product = mockingRepository.getProducts()
            products.push(product)
        }
        //esto es lo que vendría de paginate
        const prevLink= false
        const nextLink = false
        const admin = false
        //Esto es lo que traería de las sessions
        const user = mockingRepository.createUser()
        const first_name = user.first_name
        const last_name = user.last_name
        const email = user.email
        const age = user.age
        const cartId = user.cartId
        
        res.render('products', { products, prevLink, nextLink, first_name, last_name, email, age, cartId, admin, style: 'products.css' })

    }
    catch(error){
        logger.error(error)
    }
}