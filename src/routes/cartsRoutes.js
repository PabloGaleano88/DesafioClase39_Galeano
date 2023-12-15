import { Router } from "express";

import { addCart, getCartById, addProductToCart, updateProducts, updateProductQuantity, removeProductFromCart, removeAllProductsFromCart, purchase} from "../controllers/cartController.js";

const cartRouter = Router()

cartRouter.post('/', addCart)

cartRouter.get('/:cid', getCartById)

cartRouter.post('/:cid/products/:pid', addProductToCart)

cartRouter.put('/:cid', updateProducts)

cartRouter.put('/:cid/products/:pid', updateProductQuantity)

cartRouter.delete('/:cid/products/:pid', removeProductFromCart)

cartRouter.delete('/:cid', removeAllProductsFromCart)

cartRouter.get('/:cid/purchase',purchase)

export default cartRouter