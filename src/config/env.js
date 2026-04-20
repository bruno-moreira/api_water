import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DB_USER: z.string().min(1, "DB_USER é obrigatório"),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD é obrigatório"),
  DB_HOST: z.string().min(1, "DB_HOST é obrigatório"),
  DB_PORT: z.coerce.number().int().positive("DB_PORT deve ser positivo"),
  DB_NAME: z.string().min(1, "DB_NAME é obrigatório"),
  PORT: z.coerce.number().int().positive("PORT deve ser positivo").default(3000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formatted = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Variáveis de ambiente inválidas:\n${formatted}`);
}

const env = parsedEnv.data;

export default env;
