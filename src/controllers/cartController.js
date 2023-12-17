import CartManager from "../dao/MongoDB/CartManager.js";
import ProductManager from "../dao/MongoDB/ProductManager.js";
import { sendMail } from "../services/mailService.js";


const cartManager = new CartManager
const productManager = new ProductManager

export const addCart = async (req, res) => {
    try {
        const result = await cartManager.addCart()
        res.status(200).send(result)
    }
    catch (error) {
        res.status(500).send(error)
    }
}

export const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid
        const cartById = await cartManager.findCartById(cid)
        res.status(200).send(cartById)
    }
    catch (error) {
        res.status(500).send(error)
    }
}

export const addProductToCart = async (req, res) => {
    try {
        let result = ""
        const cid = req.params.cid
        const pid = req.params.pid
        const product = await productManager.findById(pid)
        if (req.user.email !== product.owner) {
            result = await cartManager.addProductToCart(cid, pid, 1)
            res.status(200).send(result)
        }
        else {
            result = "No se pude agregar un producto que tu mismo creaste"
            res.status(403).send(result)
        }
    }
    catch (error) {
        res.status(500).send(error)
    }
}

export const updateProducts = async (req, res) => {
    try{
        const cid = req.params.cid
        const productUpdate = req.body
        const result = await cartManager.updateProducts(cid, productUpdate)
        res.status(200).send(result)
    }
    catch(error){
        res.status(500).send(error)}
}

export const updateProductQuantity = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const { quantity } = req.body
        const result = await cartManager.updateProductQuantity(cid, pid, quantity)
        res.status(200).send(result)
    }
    catch(error){
        res.status(500).send(error)}
}

export const removeProductFromCart = async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const result = await cartManager.removeProductFromCart(cid, pid)
        res.status(200).send(result)
    }
    catch(error){
        res.status(500).send(error)}
}

export const removeAllProductsFromCart = async (req, res) => {
    try{
        const cid = req.params.cid
        const result = await cartManager.removeAllProductsFromCart(cid)
        res.status(200).send(result)
    }
    catch(error){
        res.status(500).send(error)}
}

export const purchase = async (req, res) => {
    try {
        const cid = req.session.cartId
        const userEmail = req.session.email
        if (req.session.isLogged) {
            const [cart] = await cartManager.findCartById(cid)
            let amountTotal = 0
            let quantityTotal = 0

            for (const producto of cart.products) {
                if (producto.quantity <= producto.productId.stock) {
                    await cartManager.removeProductFromCart(cid, producto.productId._id)
                    const newstock = producto.productId.stock - producto.quantity
                    quantityTotal += producto.quantity
                    amountTotal += producto.quantity * producto.productId.price
                    await productManager.updateProduct(producto.productId._id, "stock", newstock)
                }
            };
            amountTotal = amountTotal.toFixed(2)
            const autoCode = userEmail.substring(0, 3) + Math.floor(Math.random() * 1000 + 1)
            await cartManager.createTicket(autoCode, amountTotal, userEmail)
            sendMail(userEmail, autoCode, amountTotal)
            res.status(200).send("ok")
        }
        else {
            loggger.info("El usuario no inició sesión")

        }
    }
    catch (error) {
        logger.error("Ocurrió un error en Purchase", error)
    }
}