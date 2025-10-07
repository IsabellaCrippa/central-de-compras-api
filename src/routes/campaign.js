const express = require('express');
const router = express.Router();
const fs = require('fs'); // Módulo para ler e escrever arquivos
const path = require('path'); // Módulo para lidar com caminhos de arquivos
const crypto = require('crypto'); // Módulo para gerar IDs únicos

// Caminho para o nosso "banco de dados" JSON
const dataPath = path.join(__dirname, '..', '..', 'src/data/campaign.json');

// Função auxiliar para ler os dados do JSON
const readCampaign = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// Função auxiliar para escrever os dados no JSON
const writeCampaign = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Documentação para o Swagger
/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       required:
 *         - supplier_id
 *         - name
 *         - start_date
 *         - end_date
 *         - discount_percentage
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the campaign
 *         supplier_id:
 *           type: string
 *           description: ID of the supplier associated with the campaign
 *         name:
 *           type: string
 *           description: Name of the campaign
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Start date and time of the campaign
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: End date and time of the campaign
 *         discount_percentage:
 *           type: string
 *           description: Discount percentage for the campaign
 *     NewCampaign:
 *       type: object
 *       required:
 *         - supplier_id
 *         - name
 *         - start_date
 *         - end_date
 *         - discount_percentage
 *       properties:
 *         supplier_id:
 *           type: string
 *           description: ID of the supplier associated with the campaign
 *         name:
 *           type: string
 *           description: Name of the campaign
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Start date and time of the campaign
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: End date and time of the campaign
 *         discount_percentage:
 *           type: string
 *           description: Discount percentage for the campaign
 * 
 * tags:
 *   name: Campanhas
 *   description: Gerenciamento de campanhas da API
 */

/**
 * @swagger
 * /campaign:
 *   get:
 *     summary: Lista todos os campanhas
 *     tags: [Campanhas]
 *     responses:
 *       200:
 *         description: Lista de campanhas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', (req, res) => {
  const campaign = readCampaign();
  res.status(200).json(campaign);
});

/**
 * @swagger
 * /campaign/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Campanha encontrado.
 *       404:
 *         description: Campanha não encontrado.
 */
router.get('/:id', (req, res) => {
  const campaign = readCampaign();
  const user = campaign.find(u => u.id === req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send('Campanha não encontrado.');
  }
});

/**
 * @swagger
 * /campaign:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Campanhas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewCampaign'
 *     responses:
 *       201:
 *         description: Campanha criado com sucesso.
 */
router.post('/', (req, res) => {
  const campaign = readCampaign();
  const newUser = req.body;

  // Gera um ID único e uma senha "hash" simples (para o exemplo)
  newUser.id = crypto.randomBytes(20).toString('hex');
  newUser.pwd = crypto.createHash('sha1').update(newUser.pwd).digest('hex');
  
  campaign.push(newUser);
  writeCampaign(campaign);
  
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /campaign/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Campanha atualizado com sucesso.
 *       404:
 *         description: Campanha não encontrado.
 */
router.put('/:id', (req, res) => {
    const campaign = readCampaign();
    const index = campaign.findIndex(u => u.id === req.params.id);

    if (index !== -1) {
        // Atualiza o usuário mantendo o ID original
        campaign[index] = { ...campaign[index], ...req.body, id: req.params.id };
        writeCampaign(campaign);
        res.status(200).json(campaign[index]);
    } else {
        res.status(404).send('Campanha não encontrado.');
    }
});

/**
 * @swagger
 * /campaign/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário a ser deletado
 *     responses:
 *       200:
 *         description: Campanha deletado com sucesso.
 *       404:
 *         description: Campanha não encontrado.
 */
router.delete('/:id', (req, res) => {
    let campaign = readCampaign();
    const filteredCampaign = campaign.filter(u => u.id !== req.params.id);

    if (campaign.length !== filteredCampaign.length) {
        writeCampaign(filteredCampaign);
        res.status(200).send('Campanha deletado com sucesso.');
    } else {
        res.status(404).send('Campanha não encontrado.');
    }
});

module.exports = router;
