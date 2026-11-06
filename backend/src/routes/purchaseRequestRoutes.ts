import { Router } from 'express'
import { solicitacaoCompra } from '../controllers/purchaseRequestController.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { deptCompra } from '../middleware/rbac.middleware.js'
import { getPurchaseRequestById, getPurchaseRequests } from '../controllers/getRequests.controller.js'

const router = Router()

router.post('/solicitacaoCompra', verificarToken, solicitacaoCompra)
router.get('/solicitacoes', verificarToken, deptCompra, getPurchaseRequests)
router.get('/solicitacoes/:id', verificarToken, deptCompra, getPurchaseRequestById)

export default router