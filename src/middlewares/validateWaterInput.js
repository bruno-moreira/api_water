import { z } from "zod";

const createWaterSchema = z.object({
  wlevel: z.number().min(0).max(100),
  state: z.number().int(),
  pump_aux: z.boolean().optional(),
  wvol: z.number().int().nonnegative().optional(),
});

const validateCreateWater = (req, res, next) => {
  const parsedBody = createWaterSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      error: "Payload inválido",
      details: parsedBody.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = parsedBody.data;
  next();
};

export { validateCreateWater };
