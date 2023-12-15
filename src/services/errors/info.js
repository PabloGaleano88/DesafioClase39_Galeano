export const ProductToCartErrorInfo = () =>{
    return `No se puedo agregar el producto al carrito, posiblemente no se encontró
    el producto o el carrito no existe.`
}

export const productAddErrorInfo = (title,price, code, category, stock) => {
    return `Todos los campos deben ser completados con el siguiente formato:
    *Title: String - se recibió: ${title}
    *Description: String,
    *Price: Number - se recibió: ${price}
    *Code: String - se recibió: ${code}
    *Category: String - se recibió: ${category}
    *Stock: Number - se recibió: ${stock}`
}