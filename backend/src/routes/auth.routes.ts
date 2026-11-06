import { Router } from 'express'
import { cadastrarUsuario, login } from '../controllers/auth.controllers.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { ehAdmin } from '../middleware/rbac.middleware.js'

const router = Router()

router.post('/auth/cadastro', verificarToken, ehAdmin, cadastrarUsuario)
router.post('/auth/login', login)

export default router