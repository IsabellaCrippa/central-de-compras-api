import Product from '../models/product.js'

const criarProduto = async (req, res) => {
    const novoPedido = await Product.create(req.body);
    res.json(novoPedido);
}

const listarProdutos = async (req, res) => {
    const lista = await Product.find();
    res.json(lista);
}

const listarProdutoPorId = async (req, res) => {
    const listarProduto = await Product.findById(req.params.id);
    res.json(listarProduto);
}

const listarProdutosPorFornecedor = async (req, res) => {
    const listaPorFornecedor = await Product.findOne();
}

const atualizarProduto = async (req, res) => {
    const produtoAtualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(produtoAtualizado);
}

const deletarProduto = async (req, res) => {
    const produtoDeletado = await Product.findByIdAndDelete(req.params.id);
    res.json({message: 'Produto deletado com sucesso.'})
}

export {
    criarProduto,
    listarProdutos,
    listarProdutoPorId,
    atualizarProduto,
    deletarProduto
}