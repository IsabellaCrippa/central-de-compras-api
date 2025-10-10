const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'order.json');

const readOrders = () => {
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

const writeOrders = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao escrever arquivo:', error);
    return false;
  }
};

const isValidStatus = (status) => {
  return ['Pending', 'Shipped', 'Delivered'].includes(status);
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos - Isabele
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   store_id:
 *                     type: string
 *                   item:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         product_id:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         campaign_id:
 *                           type: string
 *                         unit_price:
 *                           type: string
 *                   total_amount:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [Pending, Shipped, Delivered]
 *                   date:
 *                     type: string
 *                     format: date-time
 */
router.get('/', (req, res) => {
  try {
    const orders = readOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado.
 *       404:
 *         description: Pedido não encontrado.
 */
router.get('/:id', (req, res) => {
  try {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Pedido não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - store_id
 *               - item
 *               - total_amount
 *             properties:
 *               store_id:
 *                 type: string
 *               item:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                     - unit_price
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     campaign_id:
 *                       type: string
 *                     unit_price:
 *                       type: string
 *               total_amount:
 *                 type: string
 *                 example: "123.00"
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered]
 *                 default: Pending
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', (req, res) => {
  try {
    const { store_id, item, total_amount, status, date } = req.body;

    if (!store_id || !item || !total_amount) {
      return res.status(400).json({ error: 'Campos obrigatórios: store_id, item, total_amount' });
    }

    if (!Array.isArray(item) || item.length === 0) {
      return res.status(400).json({ error: 'O campo item deve ser um array não vazio' });
    }

    for (const orderItem of item) {
      if (!orderItem.product_id || !orderItem.quantity || !orderItem.unit_price) {
        return res.status(400).json({ error: 'Cada item deve ter product_id, quantity e unit_price' });
      }
      if (orderItem.quantity <= 0) {
        return res.status(400).json({ error: 'A quantidade deve ser maior que zero' });
      }
    }

    const orderStatus = status || 'Pending';
    if (!isValidStatus(orderStatus)) {
      return res.status(400).json({ error: 'Status inválido. Valores permitidos: Pending, Shipped, Delivered' });
    }

    const orderDate = date || new Date().toISOString().replace('T', ' ').substring(0, 19);
    if (!isValidDate(orderDate)) {
      return res.status(400).json({ error: 'Formato de data inválido' });
    }

    const orders = readOrders();
    const newOrder = {
      id: crypto.randomBytes(20).toString('hex'),
      store_id,
      item,
      total_amount,
      status: orderStatus,
      date: orderDate
    };

    orders.push(newOrder);
    
    if (writeOrders(orders)) {
      res.status(201).json(newOrder);
    } else {
      res.status(500).json({ error: 'Erro ao salvar pedido' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_id:
 *                 type: string
 *               item:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     campaign_id:
 *                       type: string
 *                     unit_price:
 *                       type: string
 *               total_amount:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered]
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Pedido não encontrado.
 */
router.put('/:id', (req, res) => {
  try {
    const orders = readOrders();
    const index = orders.findIndex(o => o.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const updateData = req.body;

    if (updateData.status && !isValidStatus(updateData.status)) {
      return res.status(400).json({ error: 'Status inválido. Valores permitidos: Pending, Shipped, Delivered' });
    }

    if (updateData.date && !isValidDate(updateData.date)) {
      return res.status(400).json({ error: 'Formato de data inválido' });
    }

    if (updateData.item) {
      if (!Array.isArray(updateData.item) || updateData.item.length === 0) {
        return res.status(400).json({ error: 'O campo item deve ser um array não vazio' });
      }

      for (const orderItem of updateData.item) {
        if (!orderItem.product_id || !orderItem.quantity || !orderItem.unit_price) {
          return res.status(400).json({ error: 'Cada item deve ter product_id, quantity e unit_price' });
        }
        if (orderItem.quantity <= 0) {
          return res.status(400).json({ error: 'A quantidade deve ser maior que zero' });
        }
      }
    }

    orders[index] = { ...orders[index], ...updateData, id: req.params.id };
    
    if (writeOrders(orders)) {
      res.status(200).json(orders[index]);
    } else {
      res.status(500).json({ error: 'Erro ao salvar alterações' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Deleta um pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido a ser deletado
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso.
 *       404:
 *         description: Pedido não encontrado.
 */
router.delete('/:id', (req, res) => {
  try {
    let orders = readOrders();
    const initialLength = orders.length;
    orders = orders.filter(o => o.id !== req.params.id);

    if (orders.length !== initialLength) {
      if (writeOrders(orders)) {
        res.status(200).json({ message: 'Pedido deletado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Erro ao salvar alterações' });
      }
    } else {
      res.status(404).json({ error: 'Pedido não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;