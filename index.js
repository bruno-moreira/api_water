import express from 'express';
import cors from "cors";

import waterRoutes from './src/routes/waterRoutes.js';

import dotenv from "dotenv"; // Importa dotenv para carregar as variáveis de ambiente
dotenv.config(); // Configura dotenv para usar o ficheiro .env

const app = express();
app.use(cors());
app.use(express.json());

// Usar as rotas
app.use('/api/nivel', waterRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
