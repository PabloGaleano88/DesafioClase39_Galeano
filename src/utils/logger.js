import dotenv from 'dotenv'
import { createLogger, format, transports } from 'winston'

dotenv.config()

const { combine, timestamp, printf, colorize } = format

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
})

const coloredFormat = combine(
    timestamp(),
    colorize(),
    myFormat
)

const config = {
    PRODUCTION: {
        format: coloredFormat,
        transports: [new transports.Console({
            level: 'info'
        }),
        new transports.File({
            filename: 'errors.log',
            level: 'error'
        })]
    },
    DEVELOPMENT: {
        format: coloredFormat,
        transports: [new transports.Console({
            level: 'debug'
        }),
        new transports.File({
            filename: 'errors.log',
            level: 'error'
        })]
    }
}



export const logger = createLogger(config[process.env.ENVIROMENT])