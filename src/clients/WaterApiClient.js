import axios from "axios";

class WaterApiClient {
  constructor({ baseURL = "http://localhost:3000", timeoutMs = 5000, transport } = {}) {
    this.http =
      transport ||
      axios.create({
        baseURL,
        timeout: timeoutMs,
      });
  }

  async getAll() {
    const { data } = await this.http.get("/api/nivel/");
    return data;
  }

  async getById(id) {
    const { data } = await this.http.get(`/api/nivel/${id}`);
    return data;
  }

  async getLast2h() {
    const { data } = await this.http.get("/api/nivel/last2h");
    return data;
  }

  async createOne({ wlevel, state, pump_aux, wvol }) {
    const payload = { wlevel, state };

    if (typeof pump_aux === "boolean") payload.pump_aux = pump_aux;
    if (typeof wvol === "number") payload.wvol = wvol;

    const { data } = await this.http.post("/api/nivel/", payload);
    return data;
  }

  async createMany(records, { concurrency = 5, continueOnError = true } = {}) {
    const queue = [...records];
    const results = [];
    const errors = [];

    const worker = async () => {
      while (queue.length > 0) {
        const record = queue.shift();
        try {
          const created = await this.createOne(record);
          results.push(created);
        } catch (error) {
          errors.push({
            record,
            message: error?.response?.data?.error || error.message || "Erro desconhecido",
          });
          if (!continueOnError) {
            throw error;
          }
        }
      }
    };

    const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker());
    await Promise.all(workers);

    return {
      total: records.length,
      success: results.length,
      failed: errors.length,
      results,
      errors,
    };
  }

  static generateSampleRecords(count = 20) {
    return Array.from({ length: count }, (_, index) => {
      const wlevel = Math.floor(Math.random() * 101);
      const possibleStates = [0, 4, 8, 16, 32, 64, 96, 128, 220];
      const state = possibleStates[index % possibleStates.length];

      return {
        wlevel,
        state,
        pump_aux: index % 2 === 0,
        wvol: 400 + Math.floor(Math.random() * 2000),
      };
    });
  }
}

export default WaterApiClient;
