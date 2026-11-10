import { Router } from 'express'
import { atualizarStatus, cancelarSolicitacao, solicitacaoCompra } from '../controllers/purchaseRequestController.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { deptCompra } from '../middleware/rbac.middleware.js'
import { filterByUser, filtrarStatus, getPurchaseRequestById, getPurchaseRequests, resumoPedidos } from '../controllers/getRequests.controller.js'

const router = Router()

router.post('/solicitacaoCompra', verificarToken, solicitacaoCompra)
router.get('/solicitacoes', verificarToken, deptCompra, getPurchaseRequests)
router.get('/solicitacoes/resumo', verificarToken, deptCompra, resumoPedidos)
router.get('/solicitacoes/:id', verificarToken, deptCompra, getPurchaseRequestById)
router.patch('/solicitacoes/:id/cancelar', verificarToken, deptCompra, cancelarSolicitacao)
router.patch('/solicitacoes/:id/status', verificarToken, deptCompra, atualizarStatus)
router.get('/solicitacoes/status/:status', verificarToken, deptCompra, filtrarStatus)
router.get('/solicitacoes/usuario/:id', verificarToken, deptCompra, filterByUser)

export default router