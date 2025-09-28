const express = require('express');
const router = express.Router();
const fs = require('fs'); // Módulo para ler e escrever arquivos
const path = require('path'); // Módulo para lidar com caminhos de arquivos
const crypto = require('crypto'); // Módulo para gerar IDs únicos

// Caminho para o nosso "banco de dados" JSON
const dataPath = path.join(__dirname, '..', '..', 'src/data/users.json');

// Função auxiliar para ler os dados do JSON
const readUsers = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// Função auxiliar para escrever os dados no JSON
const writeUsers = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Documentação para o Swagger
/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários da API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
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
 *     tags: [Usuários]
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
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 */
router.post('/', (req, res) => {
  const users = readUsers();
  const newUser = req.body;

  // Gera um ID único e uma senha "hash" simples (para o exemplo)
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
 *     tags: [Usuários]
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
 *             $ref: '#/components/schemas/User'
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
        // Atualiza o usuário mantendo o ID original
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
 *     tags: [Usuários]
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
