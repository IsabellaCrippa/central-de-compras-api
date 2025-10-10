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
    return true;
  } catch (error) {
    console.error('Erro ao escrever arquivo:', error);
    return false;
  }
};

const isValidStatus = (status) => {
  return ['on', 'off'].includes(status);
};

const isValidCNPJ = (cnpj) => {
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return cnpjRegex.test(cnpj);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^(\d{2} \d{4} \d{4}|\d{2} \d{5}-\d{4})$/;
  return phoneRegex.test(phone);
};

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Gerenciamento de lojas - Isabella 
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
 *                     enum: [on, off]
 */
router.get('/', (req, res) => {
  try {
    const stores = readStores();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
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
  try {
    const stores = readStores();
    const store = stores.find(s => s.id === req.params.id);
    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json({ error: 'Loja não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
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
 *             required:
 *               - store_name
 *               - cnpj
 *               - contact_email
 *             properties:
 *               store_name:
 *                 type: string
 *               cnpj:
 *                 type: string
 *                 example: "12.123.123/1234-12"
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *                 example: "48 9696-5858"
 *               contact_email:
 *                 type: string
 *                 format: email
 *               status:
 *                 type: string
 *                 enum: [on, off]
 *                 default: on
 *     responses:
 *       201:
 *         description: Loja criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       409:
 *         description: CNPJ ou email já cadastrado.
 */
router.post('/', (req, res) => {
  try {
    const { store_name, cnpj, address, phone_number, contact_email, status } = req.body;

    if (!store_name || !cnpj || !contact_email) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: store_name, cnpj, contact_email' 
      });
    }

    if (!isValidCNPJ(cnpj)) {
      return res.status(400).json({ 
        error: 'Formato de CNPJ inválido. Use o formato: XX.XXX.XXX/XXXX-XX' 
      });
    }

    if (!isValidEmail(contact_email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    if (phone_number && !isValidPhone(phone_number)) {
      return res.status(400).json({ 
        error: 'Formato de telefone inválido. Use o formato: XX XXXX-XXXX' 
      });
    }

    const storeStatus = status || 'on';
    if (!isValidStatus(storeStatus)) {
      return res.status(400).json({ error: 'Status inválido. Valores permitidos: on, off' });
    }

    const stores = readStores();

    if (stores.some(s => s.cnpj === cnpj)) {
      return res.status(409).json({ error: 'CNPJ já cadastrado.' });
    }

    if (stores.some(s => s.contact_email === contact_email)) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    const newStore = {
      id: crypto.randomBytes(20).toString('hex'),
      store_name,
      cnpj,
      address: address || '',
      phone_number: phone_number || '',
      contact_email,
      status: storeStatus
    };

    stores.push(newStore);
    
    if (writeStores(stores)) {
      res.status(201).json(newStore);
    } else {
      res.status(500).json({ error: 'Erro ao salvar loja' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
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
 *                 format: email
 *               status:
 *                 type: string
 *                 enum: [on, off]
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Loja não encontrada.
 *       409:
 *         description: CNPJ ou email já cadastrado.
 */
router.put('/:id', (req, res) => {
  try {
    const stores = readStores();
    const index = stores.findIndex(s => s.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Loja não encontrada.' });
    }

    const updateData = req.body;

    if (updateData.cnpj && !isValidCNPJ(updateData.cnpj)) {
      return res.status(400).json({ 
        error: 'Formato de CNPJ inválido. Use o formato: XX.XXX.XXX/XXXX-XX' 
      });
    }

    if (updateData.contact_email && !isValidEmail(updateData.contact_email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    if (updateData.phone_number && !isValidPhone(updateData.phone_number)) {
      return res.status(400).json({ 
        error: 'Formato de telefone inválido. Use o formato: XX XXXX-XXXX' 
      });
    }

    if (updateData.status && !isValidStatus(updateData.status)) {
      return res.status(400).json({ error: 'Status inválido. Valores permitidos: on, off' });
    }

    if (updateData.cnpj && stores.some(s => s.id !== req.params.id && s.cnpj === updateData.cnpj)) {
      return res.status(409).json({ error: 'CNPJ já está em uso.' });
    }

    if (updateData.contact_email && stores.some(s => s.id !== req.params.id && s.contact_email === updateData.contact_email)) {
      return res.status(409).json({ error: 'Email já está em uso.' });
    }

    stores[index] = { ...stores[index], ...updateData, id: req.params.id };
    
    if (writeStores(stores)) {
      res.status(200).json(stores[index]);
    } else {
      res.status(500).json({ error: 'Erro ao salvar alterações' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
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
  try {
    let stores = readStores();
    const initialLength = stores.length;
    stores = stores.filter(s => s.id !== req.params.id);

    if (stores.length !== initialLength) {
      if (writeStores(stores)) {
        res.status(200).json({ message: 'Loja deletada com sucesso.' });
      } else {
        res.status(500).json({ error: 'Erro ao salvar alterações' });
      }
    } else {
      res.status(404).json({ error: 'Loja não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;