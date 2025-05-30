import pkg from 'pg'; // Importa o pacote pg
import dotenv from 'dotenv'; // Importa dotenv para carregar as variáveis de ambiente

dotenv.config(); // Configura dotenv para usar o ficheiro .env

const { Pool } = pkg; // Extrai a classe Pool do pacote pg

// Configuração do pool de conexões com PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,     // Usuário do banco de dados
  host: process.env.DB_HOST,     // Host (ex.: localhost)
  database: process.env.DB_NAME, // Nome do banco de dados
  password: process.env.DB_PASSWORD, // Senha
  port: process.env.DB_PORT,     // Porta (5432 é a padrão para PostgreSQL)
});

// Exporta o pool para ser usado nos modelos
export default pool;