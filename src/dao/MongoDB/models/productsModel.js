import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = "products"

const productsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    price:{
        type: Number,
        required: true
    },
    code:{
        type: String,
        unique: true,
        required: true
    },
    owner:{
        type:String,
        default: 'admin'
    },
    status:{
        type: Boolean
    },
    category:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    thumbnail: {
        type: Array,
        required: true
    }
})

productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollection,productsSchema)

export {productsModel}
