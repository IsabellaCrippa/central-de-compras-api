const express = require('express');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// 🔹 Importar rotas
const userRoutes = require('./src/routes/users');
const storeRoutes = require('./src/routes/store');
const supplierRoutes = require('./src/routes/supplier');
const productRoutes = require('./src/routes/product');
const orderRoutes = require('./src/routes/order');

const app = express();
const port = 3000;

app.use(express.json());

// =====================================================
// 🔹 Configuração do Swagger
// =====================================================
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API da Central de Compras',
      version: '1.0.0',
      description: 'Documentação da API da Central de Compras',
      license: { name: 'Licenciado para DAII' },
      contact: {
        name: 'Equipe de Desenvolvimento ZETTRA - Isabella, Isabele, Maria Paula',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Servidor de Desenvolvimento',
      },
    ],
  },
  apis: [path.join(__dirname, 'src/routes/*.js')],
};

const swaggerDocs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// =====================================================
// 🔹 Rotas da API (todas com prefixo /api/...)
// =====================================================
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// =====================================================
// 🔹 Rota inicial (teste rápido)
// =====================================================
app.get('/', (req, res) => {
  res.send('🚀 API da Central de Compras funcionando!');
});

// =====================================================
// 🔹 Inicialização do servidor
// =====================================================
app.listen(port, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
  console.log(`📘 Documentação Swagger: http://localhost:${port}/api-docs`);
});
