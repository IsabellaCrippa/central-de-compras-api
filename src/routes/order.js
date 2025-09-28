const express = require("express");
const router = express.Router();

let products = [
  { id: "p001", name: "Teclado e mouse", price: "200.00" },
  { id: "p002", name: "Monitor 24''", price: "850.00" },
];

// GET todos os produtos
router.get("/", (req, res) => {
  res.json(products);
});

// GET por id
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  product ? res.json(product) : res.status(404).json({ message: "Produto não encontrado" });
});

// POST criar
router.post("/", (req, res) => {
  const newProduct = { id: `p${Date.now()}`, ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

module.exports = router;
