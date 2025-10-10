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
    return true;
  } catch (error) {
    console.error('Erro ao escrever arquivo:', error);
    return false;
  }
};

const isValidStatus = (status) => {
  return ['on', 'off'].includes(status);
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
 *   name: Suppliers
 *   description: Gerenciamento de fornecedores - Isabella
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
 *                     enum: [on, off]
 */
router.get('/', (req, res) => {
  try {
    const suppliers = readSuppliers();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
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
  try {
    const suppliers = readSuppliers();
    const supplier = suppliers.find(s => s.id === req.params.id);
    if (supplier) {
      res.status(200).json(supplier);
    } else {
      res.status(404).json({ error: 'Fornecedor não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
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
 *             required:
 *               - supplier_name
 *               - contact_email
 *             properties:
 *               supplier_name:
 *                 type: string
 *               supplier_category:
 *                 type: string
 *               contact_email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *                 example: "48 9696-5858"
 *               status:
 *                 type: string
 *                 enum: [on, off]
 *                 default: on
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       409:
 *         description: Email já cadastrado.
 */
router.post('/', (req, res) => {
  try {
    const { supplier_name, supplier_category, contact_email, phone_number, status } = req.body;

    if (!supplier_name || !contact_email) {
      return res.status(400).json({ error: 'Campos obrigatórios: supplier_name, contact_email' });
    }

    if (!isValidEmail(contact_email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    if (phone_number && !isValidPhone(phone_number)) {
      return res.status(400).json({ error: 'Formato de telefone inválido. Use: XX XXXX-XXXX' });
    }

    const supplierStatus = status || 'on';
    if (!isValidStatus(supplierStatus)) {
      return res.status(400).json({ error: 'Status inválido. Valores permitidos: on, off' });
    }

    const suppliers = readSuppliers();

    if (suppliers.some(s => s.contact_email === contact_email)) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    const newSupplier = {
      id: crypto.randomBytes(20).toString('hex'),
      supplier_name,
      supplier_category: supplier_category || '',
      contact_email,
      phone_number: phone_number || '',
      status: supplierStatus
    };

    suppliers.push(newSupplier);
    
    if (writeSuppliers(suppliers)) {
      res.status(201).json(newSupplier);
    } else {
      res.status(500).json({ error: 'Erro ao salvar fornecedor' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
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
 *                 format: email
 *               phone_number:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [on, off]
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Fornecedor não encontrado.
 *       409:
 *         description: Email já cadastrado.
 */
router.put('/:id', (req, res) => {
  try {
    const suppliers = readSuppliers();
    const index = suppliers.findIndex(s => s.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Fornecedor não encontrado.' });
    }

    const updateData = req.body;

    if (updateData.contact_email && !isValidEmail(updateData.contact_email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    if (updateData.phone_number && !isValidPhone(updateData.phone_number)) {
      return res.status(400).json({ error: 'Formato de telefone inválido. Use: XX XXXX-XXXX' });
    }

    if (updateData.status && !isValidStatus(updateData.status)) {
      return res.status(400).json({ error: 'Status inválido. Valores permitidos: on, off' });
    }

    if (updateData.contact_email && suppliers.some(s => s.id !== req.params.id && s.contact_email === updateData.contact_email)) {
      return res.status(409).json({ error: 'Email já está em uso.' });
    }

    suppliers[index] = { ...suppliers[index], ...updateData, id: req.params.id };
    
    if (writeSuppliers(suppliers)) {
      res.status(200).json(suppliers[index]);
    } else {
      res.status(500).json({ error: 'Erro ao salvar alterações' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
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
  try {
    let suppliers = readSuppliers();
    const initialLength = suppliers.length;
    suppliers = suppliers.filter(s => s.id !== req.params.id);

    if (suppliers.length !== initialLength) {
      if (writeSuppliers(suppliers)) {
        res.status(200).json({ message: 'Fornecedor deletado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Erro ao salvar alterações' });
      }
    } else {
      res.status(404).json({ error: 'Fornecedor não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;