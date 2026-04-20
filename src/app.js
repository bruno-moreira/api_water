import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import waterRoutes from "./routes/waterRoutes.js";
import swaggerSpec from "./config/swagger.js";
import errorHandler from "./middlewares/errorHandler.js";

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/nivel", waterRoutes);
  app.use(errorHandler);

  return app;
};

export default createApp;
