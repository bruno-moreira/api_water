import waterModel from '../model/waterModel.js';
import waterService from '../services/waterService.js';
import HttpError from "../utils/HttpError.js";

const waterController = {
  createWater: async (req, res) => {
    const { wlevel, state, pump_aux, wvol } = req.body;
    const water = await waterService.verificaWater({
      wlevel: Number(wlevel),
      state: Number(state),
      pump_aux: typeof pump_aux === "boolean" ? pump_aux : undefined,
      wvol: typeof wvol === "number" ? wvol : undefined,
    });
    res.status(201).json(water);
  },

  createWaterQuery: async (req, res) => {
    const { wlevel, state, pump_aux, wvol } = req.query;

    if (!wlevel || !state) {
      throw new HttpError(400, "Campos obrigatórios ausentes");
    }
    const water = await waterService.verificaWater({
      wlevel: Number(wlevel),
      state: Number(state),
      pump_aux: typeof pump_aux === 'string' ? pump_aux === 'true' : undefined,
      wvol: typeof wvol === 'string' ? Number(wvol) : undefined
    });
    res.status(201).json(water);
  },

  getAllWater: async (req, res) => {
    const water = await waterModel.getAllWater();
    res.json(water);
  },

  getWaterById: async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      throw new HttpError(400, 'Parâmetro id inválido');
    }
    const water = await waterModel.getWaterById(numericId);
    if (!water) {
      throw new HttpError(404, 'Não encontrada');
    }
    res.json(water);
  },

  getLast2h: async (_req, res) => {
    const rows = await waterModel.getLast2hBuckets();
    res.json(rows);
  },
};

export default waterController;
