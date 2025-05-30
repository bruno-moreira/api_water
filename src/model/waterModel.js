import pool from "../../config/db.js"

// Modelo com funções que interagem com o banco
const waterModel = {
  createWater: async ({ hour,
            wlevel,
            pump1,
            pump2,
            protect_pump1,
            protect_pump2,
            a1_contact_pump1,
            a1_contact_pump2,
            state }) => {
  
    const result = await pool.query(
      'INSERT INTO water (hour, wlevel, pump1, pump2, protect_pump1, protect_pump2, a1_contact_pump1, a1_contact_pump2, state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [hour, wlevel, pump1, pump2, protect_pump1, protect_pump2, a1_contact_pump1, a1_contact_pump2, state]
    );
    return result.rows[0];
  },

  getAllWater: async () => {
    const result = await pool.query('SELECT * FROM water ORDER BY hour DESC LIMIT 1;');
    return result.rows;
  },

  getWaterById: async (id) => {
    const result = await pool.query('SELECT * FROM water WHERE id = $1', [id]);
    return result.rows[0];
  }
};

export default waterModel;