import messageRepository from "../repositories/messagesRepository.js"
import { logger } from "../utils/logger.js"

const MessageRepository = new messageRepository

export const getMessages = async () => {
    try {
        const message = await MessageRepository.readMessages()
        return message
    }
    catch (error) {
        logger.error("no se pudieron leer los mensajes anteriores")
    }
}

export const createMessage = async(data) =>{
    try{
        await MessageRepository.createMessage(data)
    }
    catch(error){
        logger.error("No se pudo enviar el mensaje")
    }
}