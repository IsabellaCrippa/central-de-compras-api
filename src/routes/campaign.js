const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Caminho para o arquivo JSON
const dataPath = path.join(__dirname, '..', 'data', 'campaign.json');

// Função auxiliar para ler os dados do JSON
const readCampaigns = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      const initialData = [];
      fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Função auxiliar para escrever os dados no JSON
const writeCampaigns = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Gerenciamento de campanhas
 */

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Lista todas as campanhas
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: Lista de campanhas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   supplier_id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                   end_date:
 *                     type: string
 *                   discount_percentage:
 *                     type: string
 */
router.get('/', (req, res) => {
  const campaigns = readCampaigns();
  res.status(200).json(campaigns);
});

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Busca uma campanha pelo ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da campanha
 *     responses:
 *       200:
 *         description: Campanha encontrada.
 *       404:
 *         description: Campanha não encontrada.
 */
router.get('/:id', (req, res) => {
  const campaigns = readCampaigns();
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (campaign) {
    res.status(200).json(campaign);
  } else {
    res.status(404).send('Campanha não encontrada.');
  }
});

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Cria uma nova campanha
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplier_id:
 *                 type: string
 *               name:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               discount_percentage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso.
 */
router.post('/', (req, res) => {
  const campaigns = readCampaigns();
  const newCampaign = req.body;

  // Validação dos campos obrigatórios
  if (!newCampaign.supplier_id || !newCampaign.name || !newCampaign.start_date || !newCampaign.end_date || !newCampaign.discount_percentage) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  newCampaign.id = crypto.randomBytes(20).toString('hex');
  
  campaigns.push(newCampaign);
  writeCampaigns(campaigns);
  
  res.status(201).json(newCampaign);
});

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Atualiza uma campanha existente
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da campanha a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplier_id:
 *                 type: string
 *               name:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *               discount_percentage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso.
 *       404:
 *         description: Campanha não encontrada.
 */
router.put('/:id', (req, res) => {
  const campaigns = readCampaigns();
  const index = campaigns.findIndex(c => c.id === req.params.id);

  if (index !== -1) {
    campaigns[index] = { ...campaigns[index], ...req.body, id: req.params.id };
    writeCampaigns(campaigns);
    res.status(200).json(campaigns[index]);
  } else {
    res.status(404).send('Campanha não encontrada.');
  }
});

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Deleta uma campanha
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da campanha a ser deletada
 *     responses:
 *       200:
 *         description: Campanha deletada com sucesso.
 *       404:
 *         description: Campanha não encontrada.
 */
router.delete('/:id', (req, res) => {
  let campaigns = readCampaigns();
  const filteredCampaigns = campaigns.filter(c => c.id !== req.params.id);

  if (campaigns.length !== filteredCampaigns.length) {
    writeCampaigns(filteredCampaigns);
    res.status(200).send('Campanha deletada com sucesso.');
  } else {
    res.status(404).send('Campanha não encontrada.');
  }
});

module.exports = router;