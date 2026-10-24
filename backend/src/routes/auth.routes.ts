import { Router } from 'express'
import { cadastrarUsuario, login } from '../controllers/auth.controllers.js'

const router = Router()

router.post('/cadastro', cadastrarUsuario)
router.post('/login', login)

export default router