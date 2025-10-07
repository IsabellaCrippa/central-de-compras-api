const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// 🔹 Importar rotas
const userRoutes = require('./src/routes/users');
//const supplierRoutes = require('./src/routes/supplier');//
const storeRoutes = require('./src/routes/store');
const productRoutes = require('./src/routes/product');
const orderRoutes = require('./src/routes/order');
const campaignRoutes = require('./src/routes/campaign');

const app = express();
const port = 3000;

// 🔹 Middleware
app.use(express.json());
app.use(cors()); 

// 🔹 Configuração do Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Central de Compras API',
      version: '1.0.0',
      description: 'Documentação da API da Central de Compras',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🔹 Rotas principais (SEM prefixo /api)
if (userRoutes) app.use('/users', userRoutes);
//if (supplierRoutes) app.use('/suppliers', supplierRoutes);//
if (storeRoutes) app.use('/stores', storeRoutes);
if (productRoutes) app.use('/products', productRoutes);
if (orderRoutes) app.use('/orders', orderRoutes);

// 🔹 Rota raiz
app.get('/', (req, res) => {
  res.send('API da Central de Compras rodando com sucesso!');
});

// 🔹 Servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});