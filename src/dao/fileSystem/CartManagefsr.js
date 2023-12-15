import fs from 'fs'
import { logger } from '../../utils/logger'


class CartManagerfs {
    path
    carts = []

    constructor(path) {
        this.path = path
    }

    async addCart() {
        const cart = {
            id: 0,
            products: []
        }
        try {
            if (!fs.existsSync(this.path)) {
                this.carts.push(cart)
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
            }
            else {
                const cartsGot = await this.getCarts()
                const carts = cartsGot.payload
                const maxId = await this.findMaxCartId();
                cart.id = maxId + 1
                carts.push(cart)
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
                return ({ status: 201, payload: `El carrito con id: ${cart.id} fue agregado satisfactoriamente` })
            }
        }
        catch (error) {
            logger.error(`se ha producido el siguiente error: ${error}`)
        }
    }

    async findMaxCartId() {
        try {
            const contenidoGot = await this.getCarts();
            const contenido = contenidoGot.payload
            let maxId = 0
            contenido.forEach((cart) => {
                if (cart.id > maxId) {
                    maxId = cart.id
                }
            })
            return maxId

        } catch (error) {
            logger.error(`ocurrió un error buscando los id ${error}`);
        }
    }

    async getCarts() {
        try {
            if (!fs.existsSync(this.path)) {
                return ({ status: 200, payload: this.carts })
            }
            else {
                const contenido = await fs.promises.readFile(this.path, 'utf-8')
                const contenidoParse = JSON.parse(contenido)
                return ({ status: 200, payload: contenidoParse })
            }
        } catch (error) {
            logger.error(`ocurrió un error buscando los productos ${error}`)
        }
    }

    async getCartById(id) {
        try {
            if (!fs.existsSync(this.path)) {
                logger.warn('No existe el archivo, compruebe la ruta del archivo')
            }
            else {
                const contenidoGot = await this.getCarts()
                const contenido = contenidoGot.payload
                const cartById = contenido.find((cart) => (cart.id === id))
                if (cartById)
                    return ({ status: 200, payload: cartById.products })
                else
                    return ({ status: 404, payload: "Carrito no encontrado" })
            }
        }
        catch (error) {
            logger.error(`se ha producido el siguiente error: ${error}`)
        }
    }

    async addProducts(cartId, productId, quantity) {
        const product = {
            productId,
            quantity : 1
        }
        try {
            if (!fs.existsSync(this.path)) {
                logger.warn('No existe el archivo, compruebe la ruta del archivo')
            }
            else {
                const contenidoGot = await this.getCarts()
                const contenido = contenidoGot.payload
                const cartIndex = contenido.findIndex(c => c.id === cartId);
                if (cartIndex != -1) {
                    const cart = contenido.find((thisCart) => thisCart.id == cartId)
                    const productIndex = cart.products.findIndex((p) => p.productId == productId)
                    if (productIndex != -1) {
                        contenido[cartIndex].products[productIndex].quantity+=1
                        await fs.promises.writeFile(this.path, JSON.stringify(contenido, null, '\t'))
                        return ({ status: 200, payload: `Se ha agregado una unidad a el producto con id: ${productId} - total de unidades: ${contenido[cartIndex].products[productIndex].quantity} \n` })
                    }
                    else{
                        contenido[cartIndex].products.push(product)
                        await fs.promises.writeFile(this.path, JSON.stringify(contenido, null, '\t'))
                        return ({ status: 201, payload: `Se ha agregado el producto con id: ${productId} - total de unidades: 1 \n` })
                    }
                }
                else
                    return({status:404,payload:`No se encontró el carrito con el id:${id}\n`})
            }
        }
        catch (error) {
            logger.error(`se ha producido el siguiente error: ${error}`)
        }

    }
}

export default CartManagerfs
