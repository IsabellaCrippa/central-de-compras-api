import { Router } from 'express';
import {
    criarCampanha,
    listarCampanhas,
    obterCampanhaPorId,
    atualizarCampanha,
    deletarCampanha
} from '../controller/CampaignController.js';

const router = Router();

router.post('/', criarCampanha);
router.get('/', listarCampanhas);
router.get('/:id', obterCampanhaPorId);
router.put('/:id', atualizarCampanha);
router.delete('/:id', deletarCampanha);

export default router;