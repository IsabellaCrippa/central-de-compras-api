import { Router } from "express";
import {
    criarFornecedor,
    listarFornecedores,
    listarFornecedorPorId,
    atualizarFornecedor,
    deletarFornecedor
} from '../controller/supplierController.js';

const router = Router();

router.post('/', criarFornecedor);
router.get('/', listarFornecedores);
router.get('/:id', listarFornecedorPorId);
router.put('/:id', atualizarFornecedor);
router.delete('/:id', deletarFornecedor);

export default router;