import {Router} from 'express';
import {
    criarUsuario,
    listarUsuarios,
    obterUsuarioPorId,
    atualizarUsuario,
    deletarUsuario
} from '../controller/UserController.js';

const router = Router();

router.post('/', criarUsuario);
router.get('/', listarUsuarios);
router.get('/:id', obterUsuarioPorId);
router.put('/:id', atualizarUsuario);
router.delete('/:id', deletarUsuario);

export default router;