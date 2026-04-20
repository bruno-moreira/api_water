import pool from "../../config/db.js";

// Modelo com funções que interagem com o banco
const waterModel = {
  createWater: async ({
    hour,
    wlevel,
    pump1,
    pump2,
    protect_pump1,
    protect_pump2,
    a1_contact_pump1,
    a1_contact_pump2,
    pump_aux,
    wvol,
    state,
  }) => {
    const result = await pool.query(
      "INSERT INTO water (hour, wlevel, pump1, pump2, protect_pump1, protect_pump2, a1_contact_pump1, a1_contact_pump2, pump_aux, wvol, state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [hour, wlevel, pump1, pump2, protect_pump1, protect_pump2, a1_contact_pump1, a1_contact_pump2, pump_aux, wvol, state],
    );
    return result.rows[0];
  },

  getAllWater: async () => {
    const result = await pool.query("SELECT * FROM water ORDER BY hour DESC LIMIT 100;");
    return result.rows;
  },

  getWaterById: async (id) => {
    const result = await pool.query("SELECT * FROM water WHERE id = $1", [id]);
    return result.rows[0];
  },

  getLast2hBuckets: async () => {
    const result = await pool.query(
      `
      WITH last_time AS (
        SELECT MAX(hour) AS max_hour FROM water
      ),
      intervals AS (
        SELECT generate_series(
          (SELECT max_hour FROM last_time) - INTERVAL '2 hours',
          (SELECT max_hour FROM last_time),
          interval '30 minutes'
        ) AS bucket
      )
      SELECT
        i.bucket,
        COALESCE(ROUND(AVG(w.wlevel))::int, 0) AS wlevel
      FROM intervals i
      LEFT JOIN water w
        ON w.hour >= i.bucket
        AND w.hour < i.bucket + interval '30 minutes'
      GROUP BY i.bucket
      ORDER BY i.bucket ASC
      LIMIT 4;
      `
    );
    return result.rows.map((row) => ({ hour: row.bucket, wlevel: row.wlevel }));
  },
};

export default waterModel;