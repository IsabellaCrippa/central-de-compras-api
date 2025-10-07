const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Importar rotas
const userRoutes = require('./src/routes/users');
const campaignRoutes = require('./src/routes/campaign');
const supplierRoutes = require('./src/routes/supplier');
const storeRoutes = require('./src/routes/store');
const productRoutes = require('./src/routes/product');
const orderRoutes = require('./src/routes/order');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors()); 

// Configuração do Swagger com todos os schemas
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
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            status: { type: 'string' }
          }
        },
        Campaign: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            start_date: { type: 'string', format: 'date' },
            end_date: { type: 'string', format: 'date' },
            status: { type: 'string' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' },
            category: { type: 'string' }
          }
        },
        Supplier: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            supplier_name: { type: 'string' },
            supplier_category: { type: 'string' },
            contact_email: { type: 'string' },
            phone_number: { type: 'string' },
            status: { type: 'string' }
          }
        },
        Store: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            store_name: { type: 'string' },
            cnpj: { type: 'string' },
            address: { type: 'string' },
            phone_number: { type: 'string' },
            contact_email: { type: 'string' },
            status: { type: 'string' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            customer: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'number' }
                }
              }
            },
            total: { type: 'number' },
            status: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas principais
if (userRoutes) app.use('/users', userRoutes);
if (campaignRoutes) app.use('/campaigns', campaignRoutes);
if (supplierRoutes) app.use('/suppliers', supplierRoutes);
if (storeRoutes) app.use('/stores', storeRoutes);
if (productRoutes) app.use('/products', productRoutes);
if (orderRoutes) app.use('/orders', orderRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.send('API da Central de Compras rodando com sucesso!');
});

// Servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});