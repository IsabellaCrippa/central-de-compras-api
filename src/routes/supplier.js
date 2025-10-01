const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'supplier.json');

// Função auxiliar para ler os dados do JSON
const readSuppliers = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// Função auxiliar para escrever os dados no JSON
const writeSuppliers = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

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
 */

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Gerenciamento de fornecedores
 */

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Lista todos os fornecedores
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: Lista de fornecedores retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
router.get('/', (req, res) => {
  const suppliers = readSuppliers();
  res.status(200).json(suppliers);
});

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Busca um fornecedor pelo ID
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
 *         description: Fornecedor encontrado.
 *       404:
 *         description: Fornecedor não encontrado.
 */
router.get('/:id', (req, res) => {
  const suppliers = readSuppliers();
  const supplier = suppliers.find(s => s.id === req.params.id);
  if (supplier) {
    res.status(200).json(supplier);
  } else {
    res.status(404).send('Fornecedor não encontrado.');
  }
});

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
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso.
 */
router.post('/', (req, res) => {
  const suppliers = readSuppliers();
  const newSupplier = req.body;

  // Gera um ID único seguindo o mesmo padrão do users.js
  newSupplier.id = crypto.randomBytes(20).toString('hex');
  
  suppliers.push(newSupplier);
  writeSuppliers(suppliers);
  
  res.status(201).json(newSupplier);
});

/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Atualiza um fornecedor existente
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fornecedor a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso.
 *       404:
 *         description: Fornecedor não encontrado.
 */
router.put('/:id', (req, res) => {
  const suppliers = readSuppliers();
  const index = suppliers.findIndex(s => s.id === req.params.id);

  if (index !== -1) {
    // Atualiza o fornecedor mantendo o ID original
    suppliers[index] = { ...suppliers[index], ...req.body, id: req.params.id };
    writeSuppliers(suppliers);
    res.status(200).json(suppliers[index]);
  } else {
    res.status(404).send('Fornecedor não encontrado.');
  }
});

/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Deleta um fornecedor
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fornecedor a ser deletado
 *     responses:
 *       200:
 *         description: Fornecedor deletado com sucesso.
 *       404:
 *         description: Fornecedor não encontrado.
 */
router.delete('/:id', (req, res) => {
  let suppliers = readSuppliers();
  const filteredSuppliers = suppliers.filter(s => s.id !== req.params.id);

  if (suppliers.length !== filteredSuppliers.length) {
    writeSuppliers(filteredSuppliers);
    res.status(200).send('Fornecedor deletado com sucesso.');
  } else {
    res.status(404).send('Fornecedor não encontrado.');
  }
});

module.exports = router;