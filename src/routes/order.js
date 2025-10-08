const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'order.json');

const readOrders = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      const initialData = [];
      fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo:', error);
    return [];
  }
};

const writeOrders = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao escrever arquivo:', error);
  }
};

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   customer:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                   total:
 *                     type: number
 */
router.get('/', (req, res) => {
  const orders = readOrders();
  res.status(200).json(orders);
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
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
 *         description: Pedido encontrado.
 *       404:
 *         description: Pedido não encontrado.
 */
router.get('/:id', (req, res) => {
  const orders = readOrders();
  const order = orders.find(o => o.id === req.params.id);
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ error: 'Pedido não encontrado.' });
  }
});

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
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', (req, res) => {
  const orders = readOrders();
  const newOrder = req.body;

  if (!newOrder.customer || !newOrder.items || !newOrder.total) {
    return res.status(400).json({ error: 'Campos obrigatórios: customer, items, total' });
  }

  newOrder.id = crypto.randomBytes(20).toString('hex');
  orders.push(newOrder);
  writeOrders(orders);
  res.status(201).json(newOrder);
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso.
 *       404:
 *         description: Pedido não encontrado.
 */
router.put('/:id', (req, res) => {
  const orders = readOrders();
  const index = orders.findIndex(o => o.id === req.params.id);

  if (index !== -1) {
    orders[index] = { ...orders[index], ...req.body, id: req.params.id };
    writeOrders(orders);
    res.status(200).json(orders[index]);
  } else {
    res.status(404).json({ error: 'Pedido não encontrado.' });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Deleta um pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido a ser deletado
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso.
 *       404:
 *         description: Pedido não encontrado.
 */
router.delete('/:id', (req, res) => {
  let orders = readOrders();
  const filteredOrders = orders.filter(o => o.id !== req.params.id);

  if (orders.length !== filteredOrders.length) {
    writeOrders(filteredOrders);
    res.status(200).json({ message: 'Pedido deletado com sucesso.' });
  } else {
    res.status(404).json({ error: 'Pedido não encontrado.' });
  }
});

module.exports = router;