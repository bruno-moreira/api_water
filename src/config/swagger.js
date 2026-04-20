import swaggerJSDoc from "swagger-jsdoc";
import env from "./env.js";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "API - Nível de Água",
    version: "1.0.0",
    description: "API para monitoramento e registro do nível de água e estados das bombas",
  },
  servers: [
    { url: `http://localhost:${env.PORT}`, description: "Local" },
  ],
  components: {
    schemas: {
      Water: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          hour: { type: "string", format: "date-time", example: "2025-01-01T12:00:00Z" },
          wlevel: { type: "integer", example: 55, description: "Nível de água (%)" },
          pump1: { type: "boolean", example: true },
          pump2: { type: "boolean", example: false },
          protect_pump1: { type: "boolean", example: true },
          protect_pump2: { type: "boolean", example: true },
          a1_contact_pump1: { type: "boolean", example: false },
          a1_contact_pump2: { type: "boolean", example: true },
          pump_aux: { type: "boolean", example: false },
          wvol: { type: "integer", example: 1200 },
          state: { type: "integer", example: 32 },
        },
      },
      CreateWaterBody: {
        type: "object",
        required: ["wlevel", "state"],
        properties: {
          wlevel: { type: "integer", example: 60 },
          state: { type: "integer", example: 32 },
          pump_aux: { type: "boolean", example: false },
          wvol: { type: "integer", example: 900 },
        },
      },
    },
  },
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
