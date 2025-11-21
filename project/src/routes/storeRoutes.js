import { Router } from "express";
import {
    criarLoja,
    listarLojas,
    listarLojaPorId,
    atualizarLoja,
    deletarLoja
} from '../controller/storeController.js';

const router = Router();

router.post('/', criarLoja);
router.get('/', listarLojas);
router.get('/:id', listarLojaPorId);
router.put('/:id', atualizarLoja);
router.delete('/:id', deletarLoja);

export default router;