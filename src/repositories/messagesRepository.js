import { messageModel } from "../dao/MongoDB/models/messageModels.js";

class messageRepository {

    async readMessages() {
        try {
            const messages = await messageModel.find().lean()
            return messages
        }
        catch (error) {
            throw error
        }
    }

    async createMessage(data) {
        try {
            const messages = await messageModel.create(data)
            return messages
        }
        catch (error) {
            throw error
        }
    }

}

export default messageRepository