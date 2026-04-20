import rateLimit from "express-rate-limit";

const insertLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Muitas requisições de inserção. Tente novamente em alguns minutos.",
  },
});

export { insertLimiter };
