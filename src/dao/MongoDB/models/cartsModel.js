import mongoose from 'mongoose'

const cartsCollection = "carts"

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            },
        ],
        default: [],
    },
})

cartsSchema.pre('find', function () {
    this.populate('products.productId')
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export { cartsModel }
