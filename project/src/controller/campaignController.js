import Campaign from "../models/campaign.js";

const criarCampanha = async (req, res) => {
    const novaCampanha = await Campaign.create(req.body);
    res.json(novaCampanha);
}

const listarCampanhas = async (req, res) => {
    const campanhas = await Campaign.find();
    res.json(campanhas);
}

const listarCampanhaPorId = async (req, res) => {
    const campanha = await Campaign.findById(req.params.id);
    res.json(campanha);
}

const listarCampanhaPorFornecedor = async (req, res) => {
    try {
        const { supplierId } = req.params;

        const campanhas = await Campaign.find({supplier_id: supplierId});

        res.json(campanhas);
    }
    catch (error) {
        res.status(500).json({error: "Erro ao buscar camapanhas por fornecedor"});
    }
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
    listarCampanhaPorId,
    listarCampanhaPorFornecedor,
    atualizarCampanha,
    deletarCampanha
};