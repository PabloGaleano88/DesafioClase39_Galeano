import ProductRepository from "../../repositories/productRepository.js"


const productRepository = new ProductRepository()

class ProductManager {

    async getAll(query, limit, page, sort) {
        let productsDTO = {}
        try {
            const filter = query ? { [query.split(':')[0]]: query.split(':')[1] } : {}
            const sortMapper = {
                asc: { price: 1 },
                desc: { price: -1 }
            }
            const limitQuery = limit ? parseInt(limit, 10) : 10
            const pageQuery = page ? parseInt(page, 10) : 1
            const sortQuery = sortMapper[sort] ?? undefined

            const products = await productRepository.getProducts(filter, limitQuery, pageQuery, sortQuery)

            productsDTO = {
                payload: products.docs,
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                pagingCounter: products.pagingCounter,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
            };

            return productsDTO

        }
        catch (error) {
            productsDTO = {
                status: 'error',
                payload: null,
                totalDocs: null,
                limit: null,
                totalPages: null,
                page: null,
                pagingCounter: null,
                hasPrevPage: null,
                hasNextPage: null,
                prevPage: null,
                nextPage: null,
            }

            return productsDTO
        }

    }

    async create(title, description, price, code, category, stock, thumbnail, owner) {
        try {
            return await productRepository.createProduct(title, description, price, code, category, stock, thumbnail, owner)
        }
        catch (error) {
            return (`Error al intentar agregar el producto`)
        }
    }

    async delete(id) {
        try {
            return await productRepository.deleteProduct(id)
        }
        catch (error) {
            return (`Error al intentar borrar el producto con ID:${id}`)
        }
    }

    async findById(id) {
        try {
            return await productRepository.findProductById(id)
        }
        catch (error) {
            return (`Producto con ID:${id} no encontrado`)
        }
    }

    async updateProduct(id, updateFields) {
        try {
            const fields = Object.keys(updateFields)
            fields.forEach(async element => {
                if (element !== "title" && element !== "description" && element !== "price" && element !== "code" && element !== "category" && element !== "stock") {
                    logger.warn(`${element} no es un campo valido por lo tanto no se actualizará`)
                }
                else{
                    return await productRepository.updateProductById(id, updateFields)
                }
            });
        }
        catch (error) {
            logger.error(`se ha producido el siguiente error al intentar modificar el campo: ${error}`)
        }
    }


}
export default ProductManager
