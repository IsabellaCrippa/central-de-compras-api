const express = require('express');
const fornecedoresRouter = require('./routes/fornecedores');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/fornecedores', fornecedoresRouter);

app.get('/', (req, res) => {
  res.send('API da Central de Compras funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});