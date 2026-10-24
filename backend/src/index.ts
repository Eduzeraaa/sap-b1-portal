import express from 'express'
import authRoutes from '../src/routes/auth.routes.js'
import { port } from './config/env.js'

const app = express()

app.use(express.json())
app.use('/auth', authRoutes)

function start() {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`)
    })
}

start()