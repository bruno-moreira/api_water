import createApp from "./src/app.js";
import env from "./src/config/env.js";
import logger from "./src/config/logger.js";
import pool from "./config/db.js";

const app = createApp();

// Iniciar o servidor
const PORT = env.PORT;
const server = app.listen(PORT, () => {
  logger.info(`Servidor a correr em http://localhost:${PORT}`);
  logger.info(`Swagger UI disponível em http://localhost:${PORT}/docs`);
});

const shutdown = async (signal) => {
  logger.info({ signal }, "Encerramento gracioso iniciado");

  server.close(async () => {
    try {
      await pool.end();
      logger.info("Pool de conexões PostgreSQL encerrado");
      process.exit(0);
    } catch (error) {
      logger.error({ err: error }, "Falha ao encerrar pool PostgreSQL");
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
