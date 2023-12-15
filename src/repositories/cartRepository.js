import { cartsModel } from '../dao/MongoDB/models/cartsModel.js'
import { productsModel } from '../dao/MongoDB/models/productsModel.js'
import CustomError from '../services/errors/customError.js'
import EErrors from '../services/errors/enums.js'
import { ProductToCartErrorInfo } from '../services/errors/info.js'

class CartRepository {
    async addCart() {
        try {
            const cart = await cartsModel.create({
            })
            return cart
        }
        catch (e) {
            return (`error al agregar el carrito\n${e.name}\n${e.message}`)
        }
    }

    async findCartById(id) {
        try {
            const cart = await cartsModel.find({ _id: id }).lean()
            return cart
        }
        catch (e) {
            return ("ID del carrito no encontrado")
        }
    }

    async addProductToCart(cid, pid, quantity) {
        try {
            const cart = await cartsModel.findOne({ _id: cid })
            if (!cart) {
                CustomError.createError({
                    name: "Add product to Cart Error",
                    cause: ProductToCartErrorInfo(),
                    message: "Cart Not Found",
                    code: EErrors.DATABASE_ERROR
                })
            }
            const product = await productsModel.findById(pid)
            if (!product) {
                CustomError.createError({
                    name: "Add product to Cart Error",
                    cause: ProductToCartErrorInfo(),
                    message: "Product Not Found",
                    code: EErrors.DATABASE_ERROR
                })
            }
            const productInCart = cart.products.find(({ productId }) => productId.toString() === pid)
            if (productInCart) {
                productInCart.quantity += 1
            }

            else {
                cart.products.push({ productId: pid, "quantity": quantity })
            }

            await cart.save()
            const cartUpdated = await this.findCartById(cid)
            return cartUpdated
        }
        catch (error) {
            return (`Revisa los datos ingresados.Ocurrió el siguiente error\n${error.name}\n${error.message}`)
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            await productsModel.findById(productId)
            const cart = await cartsModel.findById(cartId)
            const products = cart.products.filter((p) => !p.productId.equals(productId))
            cart.products = products
            await cart.save()
            return cart
        }
        catch (e) {
            return (`Ocurrió un error al intentar eliminar el carrito, revisa el ID del carrito y/o producto\n${e.name}\n${e.message}`)
        }
    }

    async removeAllProductsFromCart(cartId) {
        const cart = await cartsModel.findById(cartId)
        cart.products = []
        await cart.save()
        return cart
    }

    async updateProducts(cartId, productUpdate) {
        try {
            const cart = await cartsModel.findById(cartId)
            await this.removeAllProductsFromCart(cartId)
            cart.products.push(productUpdate)
            await cart.save()
            const cartUpdated = await cartsModel.findById(cartId)
            return cartUpdated
        }
        catch (e) {
            return (`Ocurrió un error al intentar realizar la actualización, los datos ingresador \n${e.name}\n${e.message}`)
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartsModel.findById(cartId)
            await productsModel.findById(productId)
            const productIndex = cart.products.findIndex((p) => p.productId.equals(productId))
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity
                await cart.save()
            }
            return cart
        }
        catch (e) {
            return (`Ocurrió un error al intentar actualizar la cantidad del producto\n Revisa el id del carrito o del producto\n${e.name}\n${e.message}`)
        }
    }

}

export default CartRepository