const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'store.json');

// Função auxiliar para ler os dados do JSON
const readStores = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// Função auxiliar para escrever os dados no JSON
const writeStores = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da loja
 *         store_name:
 *           type: string
 *           example: "Bingo Heeler"
 *         cnpj:
 *           type: string
 *           example: "12.123.123.1234-12"
 *         address:
 *           type: string
 *           example: "Bandit Hemmer, 42"
 *         phone_number:
 *           type: string
 *           example: "48 9696 5858"
 *         contact_email:
 *           type: string
 *           example: "down@bingo.com"
 *         status:
 *           type: string
 *           enum: [on, off]
 *           example: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Gerenciamento de lojas
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Lista todas as lojas
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: Lista de lojas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get('/', (req, res) => {
  const stores = readStores();
  res.status(200).json(stores);
});

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Busca uma loja pelo ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Loja encontrada.
 *       404:
 *         description: Loja não encontrada.
 */
router.get('/:id', (req, res) => {
  const stores = readStores();
  const store = stores.find(s => s.id === req.params.id);
  if (store) {
    res.status(200).json(store);
  } else {
    res.status(404).send('Loja não encontrada.');
  }
});

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Cria uma nova loja
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       201:
 *         description: Loja criada com sucesso.
 */
router.post('/', (req, res) => {
  const stores = readStores();
  const newStore = req.body;

  // Gera um ID único seguindo o mesmo padrão
  newStore.id = crypto.randomBytes(20).toString('hex');
  
  stores.push(newStore);
  writeStores(stores);
  
  res.status(201).json(newStore);
});

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Atualiza uma loja existente
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da loja a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso.
 *       404:
 *         description: Loja não encontrada.
 */
router.put('/:id', (req, res) => {
  const stores = readStores();
  const index = stores.findIndex(s => s.id === req.params.id);

  if (index !== -1) {
    // Atualiza a loja mantendo o ID original
    stores[index] = { ...stores[index], ...req.body, id: req.params.id };
    writeStores(stores);
    res.status(200).json(stores[index]);
  } else {
    res.status(404).send('Loja não encontrada.');
  }
});

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Deleta uma loja
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da loja a ser deletada
 *     responses:
 *       200:
 *         description: Loja deletada com sucesso.
 *       404:
 *         description: Loja não encontrada.
 */
router.delete('/:id', (req, res) => {
  let stores = readStores();
  const filteredStores = stores.filter(s => s.id !== req.params.id);

  if (stores.length !== filteredStores.length) {
    writeStores(filteredStores);
    res.status(200).send('Loja deletada com sucesso.');
  } else {
    res.status(404).send('Loja não encontrada.');
  }
});

module.exports = router;