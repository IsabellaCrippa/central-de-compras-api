const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Caminho para o arquivo JSON
const dataPath = path.join(__dirname, '..', 'data', 'product.json');

//ler os dados do JSON
const readProducts = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

//escrever os dados no JSON
const writeProducts = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

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
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', (req, res) => {
  const products = readProducts();
  res.status(200).json(products);
});
// lista todos os produtos

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
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
 *         description: Produto encontrado.
 *       404:
 *         description: Produto não encontrado.
 */
router.get('/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).send('Produto não encontrado.');
  }
});
// busca produto por id 

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
 *         description: Produto criado com sucesso.
 */
router.post('/', (req, res) => {
  const products = readProducts();
  const newProduct = req.body;
  newProduct.id = crypto.randomBytes(20).toString('hex');
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});
// cria novo produto

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 */
router.put('/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id);

  if (index !== -1) {
    products[index] = { ...products[index], ...req.body, id: req.params.id };
    writeProducts(products);
    res.status(200).json(products[index]);
  } else {
    res.status(404).send('Produto não encontrado.');
  }
});
//atualiza produto

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto a ser deletado
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso.
 *       404:
 *         description: Produto não encontrado.
 */

router.delete('/:id', (req, res) => {
  let products = readProducts();
  const filteredProducts = products.filter(p => p.id !== req.params.id);

  if (products.length !== filteredProducts.length) {
    writeProducts(filteredProducts);
    res.status(200).send('Produto deletado com sucesso.');
  } else {
    res.status(404).send('Produto não encontrado.');
  }
});
//deleta produto

module.exports = router;