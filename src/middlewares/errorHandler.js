import logger from "../config/logger.js";

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 ? "Erro interno do servidor" : err.message;

  if (statusCode >= 500) {
    logger.error({ err }, "Erro não tratado");
  }

  res.status(statusCode).json({
    error: message,
  });
};

export default errorHandler;
