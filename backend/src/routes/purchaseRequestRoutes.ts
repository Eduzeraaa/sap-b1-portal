import { Router } from 'express'
import { solicitacaoCompra } from '../controllers/purchaseRequestController.js'
import { verificarToken } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/solicitacaoCompra', verificarToken, solicitacaoCompra)

export default router