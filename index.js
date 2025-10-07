const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const userRoutes = require('./src/routes/users');
const storeRoutes = require('./src/routes/store');
const supplierRoutes = require('./src/routes/supplier');
const productRoutes = require('./src/routes/product');
const orderRoutes = require('./src/routes/order');
const campaignRoutes = require('./src/routes/campaign');

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json());

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
  apis: [path.join(__dirname, '/src/routes/*.js')],
};

const swaggerDocs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/users', userRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('API da Central de Compras funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação da API disponível em http://localhost:${port}/api-docs`);
});
