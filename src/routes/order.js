const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ==================== PEDIDOS ====================
let orders = [
  {
    id: "o001",
    store_id: "st001",
    item: [
      { product_id: "p001", quantity: 2, campaign_id: "c001", unit_price: "200.00" },
      { product_id: "p002", quantity: 1, campaign_id: null, unit_price: "850.00" },
    ],
    total_amount: "1250.00",
    status: "Pending",
    date: "2025-09-28 10:30:00",
  },
];

// GET - listar pedidos
app.get("/orders", (req, res) => {
  res.json(orders);
});

// GET - pedido por ID
app.get("/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  order ? res.json(order) : res.status(404).json({ message: "Pedido não encontrado" });
});

// POST - criar pedido
app.post("/orders", (req, res) => {
  const newOrder = { id: `o${Date.now()}`, ...req.body };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// PUT - atualizar pedido
app.put("/orders/:id", (req, res) => {
  const index = orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Pedido não encontrado" });
  orders[index] = { ...orders[index], ...req.body };
  res.json(orders[index]);
});

// DELETE - remover pedido
app.delete("/orders/:id", (req, res) => {
  orders = orders.filter((o) => o.id !== req.params.id);
  res.json({ message: "Pedido removido com sucesso" });
});

// Iniciar servidor
app.listen(3001, () => console.log("Servidor de Pedidos rodando em http://localhost:3001"));
