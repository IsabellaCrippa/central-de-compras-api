import Order from '../models/order.js'

const criarPedido = async (req, res) => {
    const novoPedido = await Order.create(req.body);
    res.json(novoPedido);
}

const listarPedidos = async (req, res) => {
    const lista = await Order.find();
    res.json(lista);
}

const listarPedidoPorId = async (req, res) => {
    const listarPedido = await Order.findById(req.params.id);
    res.json(listarPedido);
}

const listarPedidosPorUsuario = async(req, res) => {
    const pedidoPorUsuario = await Order.find();
}

const atualizarPedido = async (req, res) => {
    const pedidoAtualizado = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pedidoAtualizado);
}

const deletarPedido = async (req, res) => {
    const pedidoDeletado = await Order.findByIdAndDelete(req.params.id);
    res.json(pedidoDeletado);
}

export {
    criarPedido,
    listarPedidos,
    listarPedidoPorId,
    atualizarPedido,
    deletarPedido,
}