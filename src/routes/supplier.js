const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const suppliersPath = path.join(__dirname, '../data/supplier.json');

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do fornecedor
 *           example: "7a6cc1282c5f6ec0235acd2bfa788145aa2a67fd"
 *         supplier_name:
 *           type: string
 *           example: "Judite Heeler"
 *         supplier_category:
 *           type: string
 *           example: "Informatica, Seguranca"
 *         contact_email:
 *           type: string
 *           example: "j.heeler@gmail.com"
 *         phone_number:
 *           type: string
 *           example: "48 9696 5858"
 *         status:
 *           type: string
 *           enum: [on, off]
 *           example: "on"
 *     NewSupplier:
 *       type: object
 *       required:
 *         - supplier_name
 *         - contact_email
 *       properties:
 *         supplier_name:
 *           type: string
 *           example: "Novo Fornecedor"
 *         supplier_category:
 *           type: string
 *           example: "Eletronicos"
 *         contact_email:
 *           type: string
 *           example: "novo@fornecedor.com"
 *         phone_number:
 *           type: string
 *           example: "48 1234 5678"
 *         status:
 *           type: string
 *           enum: [on, off]
 *           example: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Gerenciamento de fornecedores
 */

// GET /suppliers
/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Retorna todos os fornecedores
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: Lista de fornecedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(suppliersPath, 'utf-8'));
    res.json(data.suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler fornecedores' });
  }
});

// GET /suppliers/{id}
/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Busca fornecedor por ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Fornecedor não encontrado
 */
router.get('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(suppliersPath, 'utf-8'));
    const supplier = data.suppliers.find(s => s.id === req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fornecedor' });
  }
});

// POST /suppliers
/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Cria um novo fornecedor
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewSupplier'
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 */
router.post('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(suppliersPath, 'utf-8'));
    const newSupplier = {
      id: generateId(),
      ...req.body
    };
    data.suppliers.push(newSupplier);
    fs.writeFileSync(suppliersPath, JSON.stringify(data, null, 2));
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar fornecedor' });
  }
});

// PUT /suppliers/{id}
/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Atualiza um fornecedor
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fornecedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewSupplier'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Fornecedor não encontrado
 */
router.put('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(suppliersPath, 'utf-8'));
    const index = data.suppliers.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    data.suppliers[index] = { ...data.suppliers[index], ...req.body };
    fs.writeFileSync(suppliersPath, JSON.stringify(data, null, 2));
    res.json(data.suppliers[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
});

// DELETE /suppliers/{id}
/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Remove um fornecedor
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor removido
 *       404:
 *         description: Fornecedor não encontrado
 */
router.delete('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(suppliersPath, 'utf-8'));
    const index = data.suppliers.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    data.suppliers.splice(index, 1);
    fs.writeFileSync(suppliersPath, JSON.stringify(data, null, 2));
    res.json({ message: 'Fornecedor removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover fornecedor' });
  }
});

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = router;