import CartRepository from "../../repositories/cartRepository.js"
import ProductRepository from "../../repositories/productRepository.js"
import TicketRepository from "../../repositories/ticketRepository.js"

const cartRepository = new CartRepository
const ticketRepository = new TicketRepository
const productRepository = new ProductRepository
class CartManager {
    async addCart(){
        return await cartRepository.addCart()
    }

    async findCartById(id){
        return await cartRepository.findCartById(id)
    }

    async addProductToCart(cid, pid, quantity){
        return await cartRepository.addProductToCart(cid, pid, quantity)
    }

    async removeProductFromCart(cartId, productId){
        return await cartRepository.removeProductFromCart(cartId, productId)
    }

    async removeAllProductsFromCart(cartId){
        return await cartRepository.removeAllProductsFromCart(cartId)
    }

    async updateProducts(cartId, productUpdate){
        return await cartRepository.updateProducts(cartId, productUpdate)
    }

    async updateProductQuantity(cartId, productId, quantity){
        return await cartRepository.updateProductQuantity(cartId, productId, quantity)
    }

    async createTicket(code,amount, purchaser){

        return await ticketRepository.createTicket(code,amount, purchaser)
    }

    async findTicket(code,purchaser){
        return await ticketRepository.findTicket(code,purchaser)
    }

}

export default CartManager
