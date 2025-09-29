const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const FILE_PATH = path.join(__dirname, '../data/order.json');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do pedido
 *           example: "abc123xyz"
 *         customer:
 *           type: string
 *           example: "João Silva"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "prod123"
 *               quantity:
 *                 type: number
 *                 example: 2
 *         total:
 *           type: number
 *           example: 299.9
 *     NewOrder:
 *       type: object
 *       required:
 *         - customer
 *         - items
 *       properties:
 *         customer:
 *           type: string
 *           example: "João Silva"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "prod123"
 *               quantity:
 *                 type: number
 *                 example: 2
 *         total:
 *           type: number
 *           example: 299.9
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

// GET /orders
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retorna todos os pedidos
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    res.json(data.orders || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler pedidos' });
  }
});

// GET /orders/{id}
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca pedido por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const order = (data.orders || []).find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// POST /orders
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewOrder'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      ...req.body
    };
    data.orders = data.orders || [];
    data.orders.push(newOrder);
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

// PUT /orders/{id}
/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Atualiza um pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewOrder'
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const index = (data.orders || []).findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Pedido não encontrado' });
    data.orders[index] = { ...data.orders[index], ...req.body };
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    res.json(data.orders[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

// DELETE /orders/{id}
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido removido
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const orders = data.orders || [];
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Pedido não encontrado' });
    orders.splice(index, 1);
    data.orders = orders;
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    res.json({ message: 'Pedido removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover pedido' });
  }
});

module.exports = router;
