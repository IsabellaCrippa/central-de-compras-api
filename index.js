const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

//define endpoints específicos da sua API
const userRoutes = require('./src/routes/users');
const campaignRoutes = require('./src/routes/campaign');
const supplierRoutes = require('./src/routes/supplier');
const storeRoutes = require('./src/routes/store');
const productRoutes = require('./src/routes/product');
const orderRoutes = require('./src/routes/order');

const app = express();
const port = 3000;

app.use(express.json()); // permite que a API leia requisições com corpo em JSON
app.use(cors()); 

//swagger
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
  apis: ['./src/routes/*.js'], //indica onde o Swagger vai buscar comentários para gerar a documentação automaticamente.
};

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//torna a documentação acessível em http://localhost:3000/api-docs


//Cada rota recebe um prefixo e aponta para o arquivo de rotas correspondente.
if (userRoutes) app.use('/users', userRoutes);
if (campaignRoutes) app.use('/campaigns', campaignRoutes);
if (supplierRoutes) app.use('/suppliers', supplierRoutes);
if (storeRoutes) app.use('/stores', storeRoutes);
if (productRoutes) app.use('/products', productRoutes);
if (orderRoutes) app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('API da Central de Compras rodando');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});