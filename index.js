const express = require("express");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Importa as rotas corretas (com caminho para src/routes)
const userRoutes = require("./src/routes/users");
const productRoutes = require("./src/routes/product");
const orderRoutes = require("./src/routes/order");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ==================== CONFIG SWAGGER ====================
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API da Central de Compras",
      version: "1.0.0",
      description: "Documentação da API da Central de Compras",
      license: {
        name: "Licenciado para DAII",
      },
      contact: {
        name: "Equipe de Desenvolvimento ZETTRA - Isabella, Isabele, Maria Paula",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Servidor de Desenvolvimento",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // pega documentação direto dos arquivos de rota
};

const swaggerDocs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ==================== ROTAS ====================
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);


// ==================== SERVIDOR ====================
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação da API disponível em http://localhost:${port}/api-docs`);
});
