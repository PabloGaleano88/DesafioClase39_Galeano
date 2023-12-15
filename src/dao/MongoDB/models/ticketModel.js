import mongoose from 'mongoose'

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    amount: {
        type: Number,
        requiered: true,
    },
    purchaser: {
        type: String,
        requiered:true,
    }
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export { ticketModel }
