const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const FILE_PATH = path.join(__dirname, '../data/product.json');

// Cria arquivo se não existir
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, '{"products":[]}');
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  res.json(data.products);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  const product = data.products.find(p => p.id === req.params.id);
  product ? res.json(product) : res.status(404).json({ error: 'Produto não encontrado' });
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  const newProduct = { id: Math.random().toString(36).substr(2, 9), ...req.body };
  data.products.push(newProduct);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  const index = data.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
  data.products[index] = { ...data.products[index], ...req.body };
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.json(data.products[index]);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto removido
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  data.products = data.products.filter(p => p.id !== req.params.id);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.json({ message: 'Produto removido' });
});

module.exports = router;