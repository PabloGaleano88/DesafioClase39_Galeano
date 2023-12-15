import mongoose from 'mongoose'

const recoverCollection = "recovertoken"

const recoverSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'usuarios',
    },
    expired_at:{
        type: Date,
        required: true,
    }
})

const recoverModel = mongoose.model(recoverCollection,recoverSchema)

export {recoverModel}