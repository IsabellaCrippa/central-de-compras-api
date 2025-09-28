const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ==================== PRODUTOS ====================
let products = [
  {
    id: "p001",
    name: "Teclado e mouse",
    description: "Kit teclado e mouse sem fio",
    price: "200.00",
    stock_quantity: "8",
    supplier_id: "s001",
    status: "on",
  },
  {
    id: "p002",
    name: "Monitor 24''",
    description: "Monitor LED Full HD",
    price: "850.00",
    stock_quantity: "15",
    supplier_id: "s002",
    status: "on",
  },
];

// GET - listar produtos
app.get("/products", (req, res) => {
  res.json(products);
});

// GET - produto por ID
app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  product ? res.json(product) : res.status(404).json({ message: "Produto não encontrado" });
});

// POST - criar produto
app.post("/products", (req, res) => {
  const newProduct = { id: `p${Date.now()}`, ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT - atualizar produto
app.put("/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Produto não encontrado" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE - remover produto
app.delete("/products/:id", (req, res) => {
  products = products.filter((p) => p.id !== req.params.id);
  res.json({ message: "Produto removido com sucesso" });
});

// Iniciar servidor
app.listen(3000, () => console.log("Servidor de Produtos rodando em http://localhost:3000"));
