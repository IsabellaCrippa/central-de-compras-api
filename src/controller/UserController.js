import User from "../models/user.js";

const criarUsuario = async (req, res) => {
    const novo = await User.create(req.body);
    res.json(novo);
};

const listarUsuarios = async (req, res) => {
    const usuarios = await User.find();
    res.json(usuarios);
}

const obterUsuarioPorId = async (req, res) => {
    const usuario = await User.findById(req.params.id);
    res.json(usuario);
}

const atualizarUsuario = async (req, res) => {
    const usuarioAtualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(usuarioAtualizado);
}

const deletarUsuario = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuário deletado com sucesso" });
}

export {
    criarUsuario,
    listarUsuarios,
    obterUsuarioPorId,
    atualizarUsuario,
    deletarUsuario
};