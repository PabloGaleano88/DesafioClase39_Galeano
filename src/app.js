import express from 'express'
import { errors } from './middlewares/Error.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productRouterDB from './routes/productsRoutes.js'
import cartRouterDB from './routes/cartsRoutes.js'
import viewsRouterDB from './routes/viewsRouter.js'
import userRouterDB from './routes/userRouter.js';
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';

import __dirname from './utils/index.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';

import initializePassport from './config/passport.config.js';
import sessionRouterDB from './routes/sessionRouter.js';

import { getProducts } from './controllers/productsController.js';
import { getMessages, createMessage } from './controllers/chatController.js'
import { logger } from './utils/logger.js';


const app = express()

app.use(errors)

const httpServer = app.listen(8080, () => logger.info("Servicio corriendo en el puerto 8080"))
const socketServer = new Server(httpServer)

mongoose.connect(process.env.MONGODB_PATH)

const swaggerOptions = {

    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación E-commerce CoderHouse',
            description: 'Documentación de la API de E-Commerce CoderHouse - Alumno: Pablo Galeano',
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');
app.use('/static', express.static('./public'))

app.use(
    session({
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_PATH, ttl: 15 }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 2 * 60 * 60 * 1000 }
    }
    )
)

app.use((req, res, next) => {
    req.context = { socketServer }
    next()
})

socketServer.on('connection', async (socket) => {
    logger.info(`cliente ${socket.id} conectado`)

    const { payload: products } = await getProducts()
    socket.emit("actualizar_realtimeproducts", products)

    const message = await getMessages()
    socketServer.emit('new_message', message)

    socket.on('mensaje', async (data) => {
        await createMessage(data)
        const message = await getMessages()
        socketServer.emit('new_message', message)
    })
})

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

if (process.env.PERSISTENCE === "MONGO") {
    app.use('/', viewsRouterDB)
    app.use('/api/products', productRouterDB)
    app.use('/api/carts', cartRouterDB)
    app.use('/api/session', sessionRouterDB)
    app.use('/api', userRouterDB)
}
else if (process.env.PERSISTENCE === "FS") {
    app.use('/', viewsRouterFS)
    app.use('/api/products', productRouterFS)
    app.use('/api/carts', cartRouterFS)
    app.use('/api/session', sessionRouterFS)
    app.use('/api', userRouterFS)
}