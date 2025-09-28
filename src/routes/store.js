const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const storesPath = path.join(__dirname, '../data/store.json');

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
 *           example: "7a6cc1282c5f6ec0235acd2bfa788145aa2a67fd"
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
 *     NewStore:
 *       type: object
 *       required:
 *         - store_name
 *         - cnpj
 *         - contact_email
 *       properties:
 *         store_name:
 *           type: string
 *           example: "Nova Loja"
 *         cnpj:
 *           type: string
 *           example: "12.345.678/0001-90"
 *         address:
 *           type: string
 *           example: "Rua Exemplo, 123"
 *         phone_number:
 *           type: string
 *           example: "48 1234 5678"
 *         contact_email:
 *           type: string
 *           example: "contato@novaloja.com"
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

// GET /stores
/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Retorna todas as lojas
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: Lista de lojas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(storesPath, 'utf-8'));
    res.json(data.stores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler lojas' });
  }
});

// GET /stores/{id}
/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Busca loja por ID
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
 *         description: Loja encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */
router.get('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(storesPath, 'utf-8'));
    const store = data.stores.find(s => s.id === req.params.id);
    if (!store) {
      return res.status(404).json({ error: 'Loja não encontrada' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar loja' });
  }
});

// POST /stores
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
 *             $ref: '#/components/schemas/NewStore'
 *     responses:
 *       201:
 *         description: Loja criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 */
router.post('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(storesPath, 'utf-8'));
    const newStore = {
      id: generateId(),
      ...req.body
    };
    data.stores.push(newStore);
    fs.writeFileSync(storesPath, JSON.stringify(data, null, 2));
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar loja' });
  }
});

// PUT /stores/{id}
/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Atualiza uma loja
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da loja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewStore'
 *     responses:
 *       200:
 *         description: Loja atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */
router.put('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(storesPath, 'utf-8'));
    const index = data.stores.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Loja não encontrada' });
    }
    data.stores[index] = { ...data.stores[index], ...req.body };
    fs.writeFileSync(storesPath, JSON.stringify(data, null, 2));
    res.json(data.stores[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar loja' });
  }
});

// DELETE /stores/{id}
/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Remove uma loja
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
 *         description: Loja removida
 *       404:
 *         description: Loja não encontrada
 */
router.delete('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(storesPath, 'utf-8'));
    const index = data.stores.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Loja não encontrada' });
    }
    data.stores.splice(index, 1);
    fs.writeFileSync(storesPath, JSON.stringify(data, null, 2));
    res.json({ message: 'Loja removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover loja' });
  }
});

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = router;