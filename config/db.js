import pkg from 'pg'; // Importa o pacote pg
import env from '../src/config/env.js';

const { Pool } = pkg; // Extrai a classe Pool do pacote pg

// Configuração do pool de conexões com PostgreSQL
const pool = new Pool({
  user: env.DB_USER,     // Usuário do banco de dados
  host: env.DB_HOST,     // Host (ex.: localhost)
  database: env.DB_NAME, // Nome do banco de dados
  password: env.DB_PASSWORD, // Senha
  port: env.DB_PORT,     // Porta (5432 é a padrão para PostgreSQL)
});

// Exporta o pool para ser usado nos modelos
export default pool;