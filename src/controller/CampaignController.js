import Campaign from "../models/Campaign";

const criarCampanha = async (req, res) => {
    const novaCampanha = await Campaign.create(req.body);
    res.json(novaCampanha);
}

const listarCampanhas = async (req, res) => {
    const campanhas = await Campaign.find();
    res.json(campanhas);
}

const obterCampanhaPorId = async (req, res) => {
    const campanha = await Campaign.findById(req.params.id);
    res.json(campanha);
}

const atualizarCampanha = async (req, res) => {
    const campanhaAtualizada = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(campanhaAtualizada);
}

const deletarCampanha = async (req, res) => {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: "Campanha deletada com sucesso" });
}

export {
    criarCampanha,
    listarCampanhas,
    obterCampanhaPorId,
    atualizarCampanha,
    deletarCampanha
};