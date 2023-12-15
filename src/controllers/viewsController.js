import ProductManager from "../dao/MongoDB/ProductManager.js";
import CartManager from "../dao/MongoDB/CartManager.js";
import { logger } from "../utils/logger.js";

const productManager = new ProductManager()
const cartManager = new CartManager()

export const getProductsJson = async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query
        const product = await productManager.getAll(query, limit, page, sort)
        res.send(product)
    }
    catch (error) {
        logger.error(error)
    }
}

export const getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query
    const { first_name, last_name, email, age, cartId, admin , role } = req.session
    const premium = role === "premium"
    const result = await productManager.getAll(query, limit, page, sort)
    if (!page) {
        const prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&limit=${result.limit}` : false
        const nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&limit=${result.limit}` : false
        const products = result.payload

        res.render('products', { products, prevLink, nextLink, first_name, last_name, email, age, cartId, admin, premium, style: 'products.css' })
    }
    else {
        const pageExists = parseInt(page)
        if (pageExists > result.totalPages || isNaN(pageExists) || pageExists < 1) {
            res.render('error')
        }
        else {
            const prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&limit=${result.limit}` : false
            const nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&limit=${result.limit}` : false
            const products = result.payload
            res.render('products', { products, prevLink, nextLink, first_name, last_name, email, age, cartId, admin, premium, style: 'products.css' })
        }
    }
}

export const login = (req, res) => {
    const login_fail = req.query.login_fail === 'true';
    res.render('login', { style: 'login.css', login_fail });
}

export const findCart = async (req, res) => {
    const cid = req.params.cid
    const cartById = await cartManager.findCartById(cid)
    const productsOnCart = cartById[0].products
    const session_data = req.session
    let amountTotal = 0
    let quantityTotal = 0
    if (req.session.isLogged) {
        const cid = req.session.cartId
        const userEmail = req.session.email
        productsOnCart.forEach(producto => {
            quantityTotal += producto.quantity
            amountTotal += producto.quantity * producto.productId.price
        });
        amountTotal = amountTotal.toFixed(2)
    }
    else (
        logger.info("primero debes iniciar sesion")
    )
    res.render('carts', { productsOnCart, cid, session_data, quantityTotal, amountTotal, style: 'carts.css' })
}
    
export const loggerTest = (req, res) => {
        logger.silly("Logger Test: Silly")
        logger.debug("Logger Test: Debug")
        logger.verbose("Logger Test: Verbose")
        logger.http("Logger Test: Http")
        logger.info("Logger Test: Info")
        logger.warn("Logger Test: Warning")
        logger.error("Logger Test: Error")
        res.send("Probando Logger, Mire la consola")
}

export const changePassword = (req,res) => {
    const rid = req.params.rid
    res.render('changePassword',{style: 'changepassword.css',rid})
}