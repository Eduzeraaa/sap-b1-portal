import { Router } from 'express'
import { atualizarStatus, solicitacaoCompra } from '../controllers/purchaseRequestController.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { deptCompra } from '../middleware/rbac.middleware.js'
import { filtrarStatus, getPurchaseRequestById, getPurchaseRequests } from '../controllers/getRequests.controller.js'

const router = Router()

router.post('/solicitacaoCompra', verificarToken, solicitacaoCompra)
router.get('/solicitacoes', verificarToken, deptCompra, getPurchaseRequests)
router.get('/solicitacoes/:id', verificarToken, deptCompra, getPurchaseRequestById)
router.patch('/solicitacoes/:id/status', verificarToken, deptCompra, atualizarStatus)
router.get('/solicitacoes/status/:status', verificarToken, deptCompra, filtrarStatus)

export default router