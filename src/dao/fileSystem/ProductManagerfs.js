import fs from 'fs'
import { logger } from '../../utils/logger'


class ProductManagerfs {
    path
    products = []

    constructor(path) {
        this.path = path
    }

    async addProduct({title, description, price, thumbnail, code, status, category, stock}) {
        const product = {
            id: 0,
            title,
            description,
            price,
            thumbnail:[thumbnail],
            code,
            status : true,
            category,
            stock,
        }
        if (title && description && price && thumbnail && code && category && stock) {
            try {
                if (!fs.existsSync(this.path)) {
                    this.products.push(product)
                    await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
                }
                else {
                    const contenidoGot = await this.getProducts()
                    const contenido = contenidoGot.payload
                    if (!contenido.find((product) => product.code === code)) {
                        const maxId = await this.findMaxProductId();
                        product.id = maxId + 1
                        contenido.push(product)
                        await fs.promises.writeFile(this.path, JSON.stringify(contenido, null, '\t'))
                        return ({status:201,payload:"El producto fue agregado satisfactoriamente",content: contenido})
                    }
                    else
                        return ({status:400,payload:"El codigo de producto ya existe"})
                }
            }
            catch (error) {
                logger.error(`se ha producido el siguiente error: ${error}`)
            }
        }
        else
            return ({status:400,payload:"Todos lo campos deben ser completados"})
    }

    async findMaxProductId() {
        try {
            const contenidoGot = await this.getProducts();
            const contenido = contenidoGot.payload
            let maxId = 0
            contenido.forEach((product) => {
                if (product.id > maxId) {
                    maxId = product.id
                }
            })
            return maxId

        } catch (error) {
            logger.error(`ocurrió un error buscando los id ${error}`);
        }
    }

    async getProducts() {
        try {
            if (!fs.existsSync(this.path)) {
                return({status:200,payload:this.products})
            }
            else {
                const contenido = await fs.promises.readFile(this.path,'utf-8')
                const contenidoParse = JSON.parse(contenido)
                return({status:200,payload:contenidoParse,content:contenidoParse})
            }
        } catch (error) {
            logger.error(`ocurrió un error buscando los productos ${error}`)
        }
    }

    async getProductById(id) {
        try {
            if (!fs.existsSync(this.path)) {
                logger.warn('No existe el archivo, compruebe la ruta del archivo')
            }
            else {
                const contenidoGot = await this.getProducts()
                const contenido = contenidoGot.payload
                const producto = contenido.find((product) => (product.id === id))
                if (producto)
                    return({status:200,payload:producto})
                else
                    return({status:404,payload:"Producto no encontrado"})
            }
        }
        catch (error) {
            logger.error(`se ha producido el siguiente error: ${error}`)
        }
    }

    async updateProduct(id, updateField, updateValue) {
        try {
            if (!fs.existsSync(this.path)) {
                logger.warn('No existe el archivo, compruebe la ruta del archivo')
            }
            else {
                const contenidoGot = await this.getProducts()
                const contenido = contenidoGot.payload
                const productoIndex = contenido.findIndex((product) => (product.id === id))
                if (productoIndex != -1) {
                    if (updateField === "title" || updateField === "description" || updateField === "price" || updateField === "thumbnail" || updateField === "code" || updateField === "stock" || updateField === "status" || updateField === "category") {
                        contenido[productoIndex][updateField] = updateValue
                        await fs.promises.writeFile(this.path, JSON.stringify(contenido, null, '\t'))
                        return({status:200,payload:`Se ha actualizado el campo ${updateField} con valor ${updateValue} del producto con el id: ${id} \n`})
                    }
                    else
                        return({status:404,payload:`El campo "${updateField}" no existe\n`})
                }
                else
                return({status:404,payload:`No se encontró el producto con el id:${id}\n`})
            }
        }
        catch (error) {
            logger.error(`se ha producido el siguiente error: ${error}`)
        }

    }

    async deleteProduct(id) {
        try {
            if (!fs.existsSync(this.path)) {
                logger.warn('No existe el archivo, compruebe la ruta del archivo')
            }
            else {
                const contenidoGot = await this.getProducts()
                const contenido = contenidoGot.payload
                const producto = contenido.find((product) => (product.id === id))
                if (producto) {
                    const nuevaLista = contenido.filter((producto) => producto.id != id)
                    await fs.promises.writeFile(this.path, JSON.stringify(nuevaLista, null, '\t'))
                    return({status:200,payload:`El producto con el id: ${id} se eliminó`,content:nuevaLista})
                }
                else
                    return({status:404,payload:`El producto con el id: ${id} no existe, no se eliminó ningún producto`})
            }
        }
        catch (error) {
            logger.error(`se ha producido el siguiente error: ${error}`)
        }

    }
}

export default ProductManagerfs
