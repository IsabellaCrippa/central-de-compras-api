import { Router } from "express";
import {
    criarPedido,
    listarPedidos,
    listarPedidoPorId,
    atualizarPedido,
    deletarPedido
} from '../controller/orderController.js';

const router = Router();

router.post('/', criarPedido);
router.get('/', listarPedidos);
router.get('/:id', listarPedidoPorId);
router.put('/:id', atualizarPedido);
router.delete('/:id', deletarPedido);

export default router;