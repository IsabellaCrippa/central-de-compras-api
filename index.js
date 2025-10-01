const express = require('express');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./src/routes/users');
const storeRoutes = require('./src/routes/store');
const supplierRoutes = require('./src/routes/supplier');

// 🔹 importar as novas rotas
const productRoutes = require('./src/routes/product');
const orderRoutes = require('./src/routes/order');
const campaignRoutes = require('./src/routes/campaign');

const app = express();
const port = 3000;

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
        url: `http://localhost:${port}/api/`,
        description: 'Servidor de Desenvolvimento',
      },
    ],
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID único do usuário (gerado automaticamente)',
            example: '7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd'
          },
          name: {
            type: 'string',
            example: 'Andre Faria Ruaro'
          },
          contact_email: {
            type: 'string',
            example: 'andre.ruaro@unesc.net'
          },
          user: {
            type: 'string',
            example: 'andre.ruaro'
          },
          pwd: {
            type: 'string',
            description: 'Senha criptografada',
          },
          level: {
            type: 'string',
            enum: ['admin', 'user'],
            example: 'admin'
          },
          status: {
            type: 'string',
            enum: ['on', 'off'],
            example: 'on'
          }
        }
      },
      NewUser: {
        type: 'object',
        required: ['name', 'contact_email', 'user', 'pwd', 'level', 'status'],
        properties: {
          name: {
            type: 'string',
            example: 'Novo Usuário'
          },
          contact_email: {
            type: 'string',
            example: 'novo.usuario@unesc.net'
          },
          user: {
            type: 'string',
            example: 'novo.usuario'
          },
          pwd: {
            type: 'string',
            description: 'Senha em texto plano (será criptografada)',
            example: 'senha123'
          },
          level: {
            type: 'string',
            enum: ['admin', 'user'],
            example: 'user'
          },
          status: {
            type: 'string',
            enum: ['on', 'off'],
            example: 'on'
          }
        }
      }
    }
  },
  
  apis: ['/src/routes/*.js'],
  apis: [path.join(__dirname, '/src/routes/*.js')],
};

const swaggerDocs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🔹 rotas já existentes
app.use('/users', userRoutes);
app.use('/campaign', campaignRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/stores', storeRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('API da Central de Compras funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação da API disponível em http://localhost:${port}/api-docs`);
});
