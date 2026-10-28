import express from 'express'
import authRoutes from '../src/routes/auth.routes.js'
import solicitacaoCompra  from '../src/routes/purchaseRequestRoutes.js'
import { port } from './config/env.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(authRoutes)
app.use(solicitacaoCompra)

function start() {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`)
    })
}

start()