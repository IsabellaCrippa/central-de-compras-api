const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'supplier.json');

const readSuppliers = () => {
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

const writeSuppliers = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao escrever arquivo:', error);
  }
};

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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   supplier_name:
 *                     type: string
 *                   supplier_category:
 *                     type: string
 *                   contact_email:
 *                     type: string
 *                   phone_number:
 *                     type: string
 *                   status:
 *                     type: string
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
    res.status(404).json({ error: 'Fornecedor não encontrado.' });
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
 *             type: object
 *             properties:
 *               supplier_name:
 *                 type: string
 *               supplier_category:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', (req, res) => {
  const suppliers = readSuppliers();
  const newSupplier = req.body;

  if (!newSupplier.supplier_name || !newSupplier.contact_email) {
    return res.status(400).json({ error: 'Campos obrigatórios: supplier_name, contact_email' });
  }

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
 *             type: object
 *             properties:
 *               supplier_name:
 *                 type: string
 *               supplier_category:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               status:
 *                 type: string
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
    suppliers[index] = { ...suppliers[index], ...req.body, id: req.params.id };
    writeSuppliers(suppliers);
    res.status(200).json(suppliers[index]);
  } else {
    res.status(404).json({ error: 'Fornecedor não encontrado.' });
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
    res.status(200).json({ message: 'Fornecedor deletado com sucesso.' });
  } else {
    res.status(404).json({ error: 'Fornecedor não encontrado.' });
  }
});

module.exports = router;