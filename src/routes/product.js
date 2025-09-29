const express = require('express');
const fs = require('fs').promises;
const { v4: uuid } = require('uuid');

const router = express.Router();
const FILE_PATH = './data/product.json';

// 🔹 Ler JSON
async function readFile() {
  const data = await fs.readFile(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

// 🔹 Escrever JSON
async function writeFile(data) {
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}

// GET todos os produtos
router.get('/', async (req, res) => {
  res.json(await readFile());
});

// GET produto por ID
router.get('/:id', async (req, res) => {
  const products = await readFile();
  const product = products.find(p => p.id === req.params.id);
  product ? res.json(product) : res.status(404).json({ error: 'Produto não encontrado' });
});

// POST criar produto
router.post('/', async (req, res) => {
  const products = await readFile();
  const newProduct = { id: uuid(), ...req.body };
  products.push(newProduct);
  await writeFile(products);
  res.status(201).json(newProduct);
});

// PUT atualizar produto
router.put('/:id', async (req, res) => {
  const products = await readFile();
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });

  products[index] = { ...products[index], ...req.body };
  await writeFile(products);
  res.json(products[index]);
});

// DELETE remover produto
router.delete('/:id', async (req, res) => {
  const products = await readFile();
  const filtered = products.filter(p => p.id !== req.params.id);

  if (filtered.length === products.length) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  await writeFile(filtered);
  res.json({ message: 'Produto removido' });
});

module.exports = router;
