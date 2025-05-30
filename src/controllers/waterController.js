import waterModel from '../model/waterModel.js';
import waterService from '../services/waterService.js';

const waterController = {
  createWater: async (req, res) => {
    const { wlevel, state } = req.body;

    if (!wlevel|| !state) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    try {
      const water = await waterModel.createWater({
        wlevel,
        state
      });
      res.status(201).json(water);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createWaterQuery: async (req, res) => {
    const { wlevel, state } = req.query;

    if (!wlevel || !state) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }
    try {
      const water = await waterService.verificaWater({wlevel, state});
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
    try {
      const water = await waterModel.getWaterById(id);
      if (!water) {
        return res.status(404).json({ message: 'Não encontrada' });
      }
      res.json(water);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default waterController;
