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

// 
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// 
const isValidDiscount = (discount) => {
  const discountNum = parseFloat(discount);
  return !isNaN(discountNum) && discountNum >= 0 && discountNum <= 100;
};

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Gerenciamento de campanhas - Maria Paula
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
 *                     format: date-time
 *                   end_date:
 *                     type: string
 *                     format: date-time
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
 *             required:
 *               - supplier_id
 *               - name
 *               - start_date
 *               - end_date
 *               - discount_percentage
 *             properties:
 *               supplier_id:
 *                 type: string
 *               name:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-08-15 16:00:00"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-08-15 16:00:00"
 *               discount_percentage:
 *                 type: string
 *                 example: "20"
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

    
    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return res.status(400).json({ error: 'Formato de data inválido' });
    }

    
    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ error: 'Data de início deve ser anterior à data de fim' });
    }

    if (!isValidDiscount(discount_percentage)) {
      return res.status(400).json({ error: 'Porcentagem de desconto deve ser um valor entre 0 e 100' });
    }

    const campaigns = readCampaigns();
    
    const existingCampaign = campaigns.find(c => 
      c.supplier_id === supplier_id && c.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingCampaign) {
      return res.status(409).json({ error: 'Já existe uma campanha com este nome para este fornecedor' });
    }

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
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               discount_percentage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Campanha não encontrada.
 *       409:
 *         description: Já existe uma campanha com este nome.
 */
router.put('/:id', (req, res) => {
  try {
    const campaigns = readCampaigns();
    const index = campaigns.findIndex(c => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Campanha não encontrada.' });
    }

    const updateData = req.body;

    if (updateData.start_date && !isValidDate(updateData.start_date)) {
      return res.status(400).json({ error: 'Formato de data de início inválido' });
    }
    if (updateData.end_date && !isValidDate(updateData.end_date)) {
      return res.status(400).json({ error: 'Formato de data de fim inválido' });
    }

    const startDate = updateData.start_date || campaigns[index].start_date;
    const endDate = updateData.end_date || campaigns[index].end_date;
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'Data de início deve ser anterior à data de fim' });
    }

    if (updateData.discount_percentage && !isValidDiscount(updateData.discount_percentage)) {
      return res.status(400).json({ error: 'Porcentagem de desconto deve ser um valor entre 0 e 100' });
    }

    if (updateData.name) {
      const existingCampaign = campaigns.find(c => 
        c.id !== req.params.id && 
        c.supplier_id === (updateData.supplier_id || campaigns[index].supplier_id) && 
        c.name.toLowerCase() === updateData.name.toLowerCase()
      );
      
      if (existingCampaign) {
        return res.status(409).json({ error: 'Já existe uma campanha com este nome para este fornecedor' });
      }
    }

    campaigns[index] = { ...campaigns[index], ...updateData, id: req.params.id };
    
    if (writeCampaigns(campaigns)) {
      res.status(200).json(campaigns[index]);
    } else {
      res.status(500).json({ error: 'Erro ao salvar alterações' });
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