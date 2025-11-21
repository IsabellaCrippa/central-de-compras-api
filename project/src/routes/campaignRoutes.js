import { Router } from 'express';
import {
    criarCampanha,
    listarCampanhas,
    listarCampanhaPorId,
    listarCampanhaPorFornecedor,
    atualizarCampanha,
    deletarCampanha
} from '../controller/campaignController.js';

const router = Router();

router.post('/', criarCampanha);
router.get('/', listarCampanhas);
router.get('/:id', listarCampanhaPorId);
router.get('/supplier/:supplierId', listarCampanhaPorFornecedor);
router.put('/:id', atualizarCampanha);
router.delete('/:id', deletarCampanha);

export default router;