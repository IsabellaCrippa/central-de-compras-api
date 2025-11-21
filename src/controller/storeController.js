import Store from '../models/store.js';

const criarLoja = async (req, res) => {
    const novaLoja = await Store.create(req.body);
    res.json(novaLoja);
}

const listarLojas = async (req, res) => {
    const lista = await Store.find();
    res.json(lista);
}

const listarLojaPorId = async (req, res) => {
    const loja_id = await Store.findById(req.params.id);
    res.json(loja_id);
}

const atualizarLoja = async (req, res) => {
    const lojaAtualizada = await Store.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(lojaAtualizada);
}

const deletarLoja = async (req, res) => {
    const lojaDeletada = await Store.findByIdAndDelete(req.params.id);
    res.json('Loja deletada com sucesso.')
}

export {
    criarLoja,
    listarLojas,
    listarLojaPorId,
    atualizarLoja,
    deletarLoja,
}