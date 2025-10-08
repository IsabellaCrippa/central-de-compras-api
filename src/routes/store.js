const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'store.json');

const readStores = () => {
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

const writeStores = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao escrever arquivo:', error);
  }
};

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Gerenciamento de lojas
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Lista todas as lojas
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: Lista de lojas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   store_name:
 *                     type: string
 *                   cnpj:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone_number:
 *                     type: string
 *                   contact_email:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', (req, res) => {
  const stores = readStores();
  res.status(200).json(stores);
});

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Busca uma loja pelo ID
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
 *         description: Loja encontrada.
 *       404:
 *         description: Loja não encontrada.
 */
router.get('/:id', (req, res) => {
  const stores = readStores();
  const store = stores.find(s => s.id === req.params.id);
  if (store) {
    res.status(200).json(store);
  } else {
    res.status(404).json({ error: 'Loja não encontrada.' });
  }
});

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
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Loja criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', (req, res) => {
  const stores = readStores();
  const newStore = req.body;

  if (!newStore.store_name || !newStore.cnpj || !newStore.contact_email) {
    return res.status(400).json({ error: 'Campos obrigatórios: store_name, cnpj, contact_email' });
  }

  newStore.id = crypto.randomBytes(20).toString('hex');
  
  stores.push(newStore);
  writeStores(stores);
  
  res.status(201).json(newStore);
});

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Atualiza uma loja existente
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da loja a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso.
 *       404:
 *         description: Loja não encontrada.
 */
router.put('/:id', (req, res) => {
  const stores = readStores();
  const index = stores.findIndex(s => s.id === req.params.id);

  if (index !== -1) {
    stores[index] = { ...stores[index], ...req.body, id: req.params.id };
    writeStores(stores);
    res.status(200).json(stores[index]);
  } else {
    res.status(404).json({ error: 'Loja não encontrada.' });
  }
});

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Deleta uma loja
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da loja a ser deletada
 *     responses:
 *       200:
 *         description: Loja deletada com sucesso.
 *       404:
 *         description: Loja não encontrada.
 */
router.delete('/:id', (req, res) => {
  let stores = readStores();
  const filteredStores = stores.filter(s => s.id !== req.params.id);

  if (stores.length !== filteredStores.length) {
    writeStores(filteredStores);
    res.status(200).json({ message: 'Loja deletada com sucesso.' });
  } else {
    res.status(404).json({ error: 'Loja não encontrada.' });
  }
});

module.exports = router;