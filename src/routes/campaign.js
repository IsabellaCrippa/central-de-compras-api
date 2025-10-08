const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'campaign.json');

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
    console.error('Erro ao ler arquivo campaign.json:', error);
    return [];
  }
};

const writeCampaigns = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao escrever arquivo campaign.json:', error);
    return false;
  }
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
  try {
    const campaigns = readCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
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
  try {
    const campaigns = readCampaigns();
    const campaign = campaigns.find(c => c.id === req.params.id);
    if (campaign) {
      res.status(200).json(campaign);
    } else {
      res.status(404).json({ error: 'Campanha não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
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
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', (req, res) => {
  try {
    const { supplier_id, name, start_date, end_date, discount_percentage } = req.body;
    
    if (!supplier_id || !name || !start_date || !end_date || !discount_percentage) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const campaigns = readCampaigns();
    const newCampaign = {
      id: crypto.randomBytes(20).toString('hex'),
      supplier_id,
      name,
      start_date,
      end_date,
      discount_percentage
    };
    
    campaigns.push(newCampaign);
    
    if (writeCampaigns(campaigns)) {
      res.status(201).json(newCampaign);
    } else {
      res.status(500).json({ error: 'Erro ao salvar campanha' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
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
  try {
    const campaigns = readCampaigns();
    const index = campaigns.findIndex(c => c.id === req.params.id);

    if (index !== -1) {
      campaigns[index] = { ...campaigns[index], ...req.body, id: req.params.id };
      
      if (writeCampaigns(campaigns)) {
        res.status(200).json(campaigns[index]);
      } else {
        res.status(500).json({ error: 'Erro ao salvar alterações' });
      }
    } else {
      res.status(404).json({ error: 'Campanha não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
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
  try {
    let campaigns = readCampaigns();
    const filteredCampaigns = campaigns.filter(c => c.id !== req.params.id);

    if (campaigns.length !== filteredCampaigns.length) {
      if (writeCampaigns(filteredCampaigns)) {
        res.status(200).json({ message: 'Campanha deletada com sucesso.' });
      } else {
        res.status(500).json({ error: 'Erro ao salvar alterações' });
      }
    } else {
      res.status(404).json({ error: 'Campanha não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;