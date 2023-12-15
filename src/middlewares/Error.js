import { logger } from "../utils/logger.js"

export const errors = async (req,res,next) =>{
    logger.info(`${req.method} en ${req.url}`)
    try{
        await next()
    }
    catch(error){
        logger.error(error)
    }
}