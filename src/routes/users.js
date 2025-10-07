const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

const readUsers = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

const writeUsers = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
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
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', (req, res) => {
  const users = readUsers();
  res.status(200).json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado.
 *       404:
 *         description: Usuário não encontrado.
 */
router.get('/:id', (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send('Usuário não encontrado.');
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               pwd:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 */
router.post('/', (req, res) => {
  const users = readUsers();
  const newUser = req.body;

  newUser.id = crypto.randomBytes(20).toString('hex');
  newUser.pwd = crypto.createHash('sha1').update(newUser.pwd).digest('hex');
  
  users.push(newUser);
  writeUsers(users);
  
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
router.put('/:id', (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === req.params.id);

  if (index !== -1) {
    users[index] = { ...users[index], ...req.body, id: req.params.id };
    writeUsers(users);
    res.status(200).json(users[index]);
  } else {
    res.status(404).send('Usuário não encontrado.');
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário a ser deletado
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
router.delete('/:id', (req, res) => {
  let users = readUsers();
  const filteredUsers = users.filter(u => u.id !== req.params.id);

  if (users.length !== filteredUsers.length) {
    writeUsers(filteredUsers);
    res.status(200).send('Usuário deletado com sucesso.');
  } else {
    res.status(404).send('Usuário não encontrado.');
  }
});

module.exports = router;