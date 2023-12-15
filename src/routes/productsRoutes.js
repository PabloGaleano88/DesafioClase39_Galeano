import { Router } from "express";
import { uploader } from "../middlewares/multer.js";
import { getProducts,getProductById,addProduct,updateProduct,deleteProduct } from "../controllers/productsController.js";

const router = Router()

router.get('/',getProducts)

router.get('/:pid',getProductById)

router.post('/', uploader.single('file'),addProduct)

router.put('/:pid',updateProduct)

router.delete('/:pid', deleteProduct)


export default router