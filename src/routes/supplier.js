const express = require('express');
const router = express.Router();
const fs = require('fs');

const dataPath = './data/fornecedores.json';

// GET - Listar todos os fornecedores
router.get('/', (req, res) => {
  // Lógica para ler e retornar o conteúdo do fornecedores.json
});

// GET - Buscar um fornecedor por ID
router.get('/:id', (req, res) => {
  // Lógica para buscar um fornecedor pelo ID
});

// POST - Criar um novo fornecedor
router.post('/', (req, res) => {
  // Lógica para adicionar um novo fornecedor ao arquivo JSON
});

// PUT - Atualizar um fornecedor
router.put('/:id', (req, res) => {
  // Lógica para atualizar um fornecedor existente
});

// DELETE - Deletar um fornecedor
router.delete('/:id', (req, res) => {
  // Lógica para remover um fornecedor
});

module.exports = router;