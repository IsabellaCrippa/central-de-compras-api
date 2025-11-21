import { Router } from "express";
import {
    criarProduto,
    listarProdutos,
    listarProdutoPorId,
    listarProdutosPorFornecedor,
    atualizarProduto,
    deletarProduto
} from '../controller/productController.js';

const router = Router();

router.post('/', criarProduto);
router.get('/', listarProdutos);
router.get('/:id', listarProdutoPorId);
router.get('/supplier/:supplierId', listarProdutosPorFornecedor);
router.put('/:id', atualizarProduto);
router.delete('/:id', deletarProduto);

export default router;