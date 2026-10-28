import { Router } from 'express'
import { cadastrarUsuario, login } from '../controllers/auth.controllers.js'

const router = Router()

router.post('/auth/cadastro', cadastrarUsuario)
router.post('/auth/login', login)

export default router