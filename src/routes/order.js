import express from "express";
import { promises as fs } from "fs";
import { v4 as uuid } from "uuid";

const router = express.Router();
const FILE_PATH = "./data/order.json";

// 🔹 Ler JSON
async function readFile() {
  const data = await fs.readFile(FILE_PATH, "utf-8");
  return JSON.parse(data);
}

// 🔹 Escrever JSON
async function writeFile(data) {
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}

// GET todos os pedidos
router.get("/", async (req, res) => {
  res.json(await readFile());
});

// GET pedido por ID
router.get("/:id", async (req, res) => {
  const orders = await readFile();
  const order = orders.find(o => o.id === req.params.id);
  order ? res.json(order) : res.status(404).json({ error: "Pedido não encontrado" });
});

// POST criar pedido
router.post("/", async (req, res) => {
  const orders = await readFile();
  const newOrder = { id: uuid(), ...req.body };
  orders.push(newOrder);
  await writeFile(orders);
  res.status(201).json(newOrder);
});

// PUT atualizar pedido
router.put("/:id", async (req, res) => {
  const orders = await readFile();
  const index = orders.findIndex(o => o.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: "Pedido não encontrado" });

  orders[index] = { ...orders[index], ...req.body };
  await writeFile(orders);
  res.json(orders[index]);
});

// DELETE remover pedido
router.delete("/:id", async (req, res) => {
  const orders = await readFile();
  const filtered = orders.filter(o => o.id !== req.params.id);

  if (filtered.length === orders.length) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  await writeFile(filtered);
  res.json({ message: "Pedido removido" });
});

export default router;
