import waterModel from '../model/waterModel.js';
import waterService from '../services/waterService.js';

const waterController = {
  createWater: async (req, res) => {
    const { wlevel, state, pump_aux, wvol } = req.body;

    if (!wlevel|| !state) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    try {
      const water = await waterModel.createWater({
        wlevel,
        state,
        pump_aux,
        wvol
      });
      res.status(201).json(water);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWaterQuery: async (req, res) => {
    const { wlevel, state, pump_aux, wvol } = req.query;

    if (!wlevel || !state) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }
    try {
      const water = await waterService.verificaWater({
        wlevel: Number(wlevel),
        state: Number(state),
        pump_aux: typeof pump_aux === 'string' ? pump_aux === 'true' : undefined,
        wvol: typeof wvol === 'string' ? Number(wvol) : undefined
      });
      res.status(201).json(water);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllWater: async (req, res) => {
    try {
      const water = await waterModel.getAllWater();
      res.json(water);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getWaterById: async (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) {
      return res.status(400).json({ error: 'Parâmetro id inválido' });
    }
    try {
      const water = await waterModel.getWaterById(numericId);
      if (!water) {
        return res.status(404).json({ message: 'Não encontrada' });
      }
      res.json(water);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLast4h: async (_req, res) => {
    try {
      const rows = await waterModel.getLast4hBuckets();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default waterController;
