const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

const readUsers = () => {
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

const writeUsers = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao escrever arquivo:', error);
  }
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários - Maria Paula
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
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
 *                   contact_email:
 *                     type: string
 *                   user:
 *                     type: string
 *                   level:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', (req, res) => {
  const users = readUsers();
  // Remove senhas dos resultados
  const usersWithoutPwd = users.map(({ pwd, ...user }) => user);
  res.status(200).json(usersWithoutPwd);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags: 
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
    const { pwd, ...userWithoutPwd } = user;
    res.status(200).json(userWithoutPwd);
  } else {
    res.status(404).json({ error: 'Usuário não encontrado.' });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - contact_email
 *               - user
 *               - pwd
 *             properties:
 *               name:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               user:
 *                 type: string
 *               pwd:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *               status:
 *                 type: string
 *                 enum: [on, off]
 *                 default: on
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       409:
 *         description: Email ou usuário já existe.
 */
router.post('/', (req, res) => {
  const users = readUsers();
  const newUser = req.body;

  if (!newUser.name || !newUser.contact_email || !newUser.user || !newUser.pwd) {
    return res.status(400).json({ error: 'Campos obrigatórios: name, contact_email, user, pwd' });
  }

  // Verifica se email ou usuário já existem
  if (users.some(u => u.contact_email === newUser.contact_email)) {
    return res.status(409).json({ error: 'Email já cadastrado.' });
  }
  if (users.some(u => u.user === newUser.user)) {
    return res.status(409).json({ error: 'Nome de usuário já existe.' });
  }

  newUser.id = crypto.randomBytes(20).toString('hex');
  newUser.pwd = crypto.createHash('sha256').update(newUser.pwd).digest('hex');
  newUser.level = newUser.level || 'user';
  newUser.status = newUser.status || 'on';
  
  users.push(newUser);
  writeUsers(users);
  
  const { pwd, ...userWithoutPwd } = newUser;
  res.status(201).json(userWithoutPwd);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: 
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
 *               contact_email:
 *                 type: string
 *               user:
 *                 type: string
 *               pwd:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [admin, user]
 *               status:
 *                 type: string
 *                 enum: [on, off]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Usuário não encontrado.
 *       409:
 *         description: Email ou usuário já existe.
 */
router.put('/:id', (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  const updateData = req.body;

  
  if (updateData.contact_email && users.some(u => u.id !== req.params.id && u.contact_email === updateData.contact_email)) {
    return res.status(409).json({ error: 'Email já está em uso.' });
  }
  if (updateData.user && users.some(u => u.id !== req.params.id && u.user === updateData.user)) {
    return res.status(409).json({ error: 'Nome de usuário já está em uso.' });
  }

  
  if (updateData.pwd) {
    updateData.pwd = crypto.createHash('sha256').update(updateData.pwd).digest('hex');
  }

  users[index] = { ...users[index], ...updateData };
  writeUsers(users);
  
  const { pwd, ...userWithoutPwd } = users[index];
  res.status(200).json(userWithoutPwd);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: 
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
  const initialLength = users.length;
  users = users.filter(u => u.id !== req.params.id);

  if (users.length !== initialLength) {
    writeUsers(users);
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } else {
    res.status(404).json({ error: 'Usuário não encontrado.' });
  }
});

module.exports = router;