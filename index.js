import express from 'express';
import cors from "cors";

import waterRoutes from './src/routes/waterRoutes.js';

import dotenv from "dotenv"; // Importa dotenv para carregar as variáveis de ambiente
dotenv.config(); // Configura dotenv para usar o ficheiro .env

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
app.use(cors());
app.use(express.json());

// Swagger/OpenAPI config
const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'API - Nível de Água',
    version: '1.0.0',
    description: 'API para monitoramento e registro do nível de água e estados das bombas',
  },
  servers: [
    { url: `http://localhost:${process.env.PORT || 3000}`, description: 'Local' },
  ],
  components: {
    schemas: {
      Water: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          hour: { type: 'string', format: 'date-time', example: '2025-01-01T12:00:00Z' },
          wlevel: { type: 'integer', example: 55, description: 'Nível de água (%)' },
          pump1: { type: 'boolean', example: true },
          pump2: { type: 'boolean', example: false },
          protect_pump1: { type: 'boolean', example: true },
          protect_pump2: { type: 'boolean', example: true },
          a1_contact_pump1: { type: 'boolean', example: false },
          a1_contact_pump2: { type: 'boolean', example: true },
          pump_aux: { type: 'boolean', example: false },
          wvol: { type: 'integer', example: 1200 },
          state: { type: 'integer', example: 32 }
        }
      },
      CreateWaterBody: {
        type: 'object',
        required: ['wlevel', 'state'],
        properties: {
          wlevel: { type: 'integer', example: 60 },
          state: { type: 'integer', example: 32 },
          pump_aux: { type: 'boolean', example: false },
          wvol: { type: 'integer', example: 900 }
        }
      }
    }
  }
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Usar as rotas
app.use('/api/nivel', waterRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
  console.log(`Swagger UI disponível em http://localhost:${PORT}/docs`);
});
