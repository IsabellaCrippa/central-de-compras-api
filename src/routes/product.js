const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const FILE_PATH = path.join(__dirname, '../data/product.json');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do produto
 *           example: "abc123xyz"
 *         name:
 *           type: string
 *           example: "Teclado Mecânico"
 *         price:
 *           type: number
 *           example: 199.9
 *         stock:
 *           type: number
 *           example: 50
 *     NewProduct:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: "Teclado Mecânico"
 *         price:
 *           type: number
 *           example: 199.9
 *         stock:
 *           type: number
 *           example: 50
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos
 */

// GET /products
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
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    res.json(data.products || []);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler produtos' });
  }
});

// GET /products/{id}
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
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
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const product = (data.products || []).find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// POST /products
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
 *             $ref: '#/components/schemas/NewProduct'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      ...req.body
    };
    data.products = data.products || [];
    data.products.push(newProduct);
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// PUT /products/{id}
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProduct'
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
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const index = (data.products || []).findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
    data.products[index] = { ...data.products[index], ...req.body };
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    res.json(data.products[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// DELETE /products/{id}
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const products = data.products || [];
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
    products.splice(index, 1);
    data.products = products;
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

module.exports = router;
