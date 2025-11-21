import Supplier from '../models/supplier.js';

const criarFornecedor = async (req, res) => {
    const novoFornecedor = await Supplier.create(req.body);
    res.json(novoFornecedor);
}

const listarFornecedores = async (req, res) => {
    const lista = await Supplier.find();
    res.json(lista);
}

const listarFornecedorPorId = async (req, res) => {
    const listarFornecedor = await Supplier.findById(req.params.id);
    res.json(listarFornecedor);
}

const atualizarFornecedor = async (req, res) => {
    const fornecedorAtualizado = await Supplier.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(fornecedorAtualizado);
}

const deletarFornecedor = async (req, res) => {
    const fornecedorDeletado = await Supplier.findByIdAndDelete(req.params.id);
    res.json({message: 'Fornecedor deletado com sucesso.'});
}

export {
    criarFornecedor,
    listarFornecedores,
    listarFornecedorPorId,
    atualizarFornecedor,
    deletarFornecedor,
}