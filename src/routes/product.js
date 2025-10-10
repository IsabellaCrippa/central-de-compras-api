const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'product.json');

const readProducts = () => {
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

const writeProducts = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao escrever arquivo:', error);
    return false;
  }
};

const isValidStatus = (status) => {
  return ['on', 'off'].includes(status);
};

const isValidPrice = (price) => {
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum >= 0;
};

const isValidStock = (stock) => {
  const stockNum = parseInt(stock);
  return !isNaN(stockNum) && stockNum >= 0;
};

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos - Isabele
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: string
 *                   stock_quantity:
 *                     type: string
 *                   supplier_id:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [on, off]
 */
router.get('/', (req, res) => {
  try {
    const products = readProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

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
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Produto não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
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
 *               - description
 *               - price
 *               - stock_quantity
 *               - supplier_id
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *                 example: "200.00"
 *               stock_quantity:
 *                 type: string
 *                 example: "8"
 *               supplier_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [on, off]
 *                 default: on
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', (req, res) => {
  try {
    const { name, description, price, stock_quantity, supplier_id, status } = req.body;

    if (!name || !description || !price || !stock_quantity || !supplier_id) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: name, description, price, stock_quantity, supplier_id' 
      });
    }

    if (!isValidPrice(price)) {
      return res.status(400).json({ error: 'Preço deve ser um valor numérico positivo' });
    }

    if (!isValidStock(stock_quantity)) {
      return res.status(400).json({ error: 'Quantidade em estoque deve ser um número inteiro positivo' });
    }

    const productStatus = status || 'on';
    if (!isValidStatus(productStatus)) {
      return res.status(400).json({ error: 'Status inválido. Valores permitidos: on, off' });
    }

    const products = readProducts();
    
    const existingProduct = products.find(p => 
      p.supplier_id === supplier_id && p.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingProduct) {
      return res.status(409).json({ error: 'Já existe um produto com este nome para este fornecedor' });
    }

    const newProduct = {
      id: crypto.randomBytes(20).toString('hex'),
      name,
      description,
      price,
      stock_quantity,
      supplier_id,
      status: productStatus
    };

    products.push(newProduct);
    
    if (writeProducts(products)) {
      res.status(201).json(newProduct);
    } else {
      res.status(500).json({ error: 'Erro ao salvar produto' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *               stock_quantity:
 *                 type: string
 *               supplier_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [on, off]
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Produto não encontrado.
 *       409:
 *         description: Já existe um produto com este nome.
 */
router.put('/:id', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const updateData = req.body;

    if (updateData.price && !isValidPrice(updateData.price)) {
      return res.status(400).json({ error: 'Preço deve ser um valor numérico positivo' });
    }

    if (updateData.stock_quantity && !isValidStock(updateData.stock_quantity)) {
      return res.status(400).json({ error: 'Quantidade em estoque deve ser um número inteiro positivo' });
    }

    if (updateData.status && !isValidStatus(updateData.status)) {
      return res.status(400).json({ error: 'Status inválido. Valores permitidos: on, off' });
    }

    if (updateData.name) {
      const existingProduct = products.find(p => 
        p.id !== req.params.id && 
        p.supplier_id === (updateData.supplier_id || products[index].supplier_id) && 
        p.name.toLowerCase() === updateData.name.toLowerCase()
      );
      
      if (existingProduct) {
        return res.status(409).json({ error: 'Já existe um produto com este nome para este fornecedor' });
      }
    }

    products[index] = { ...products[index], ...updateData, id: req.params.id };
    
    if (writeProducts(products)) {
      res.status(200).json(products[index]);
    } else {
      res.status(500).json({ error: 'Erro ao salvar alterações' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

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
  try {
    let products = readProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== req.params.id);

    if (products.length !== initialLength) {
      if (writeProducts(products)) {
        res.status(200).json({ message: 'Produto deletado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Erro ao salvar alterações' });
      }
    } else {
      res.status(404).json({ error: 'Produto não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;