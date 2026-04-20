import test from "node:test";
import assert from "node:assert/strict";
import pool from "../../config/db.js";
import waterModel from "./waterModel.js";

test("createWater usa query parametrizada no INSERT", async () => {
  const originalQuery = pool.query;
  let capturedSql = "";
  let capturedValues = [];

  pool.query = async (sql, values) => {
    capturedSql = sql;
    capturedValues = values;
    return { rows: [{ id: 1 }] };
  };

  try {
    await waterModel.createWater({
      hour: "2026-04-20 12:00:00",
      wlevel: 30,
      pump1: true,
      pump2: false,
      protect_pump1: false,
      protect_pump2: false,
      a1_contact_pump1: false,
      a1_contact_pump2: false,
      pump_aux: false,
      wvol: 500,
      state: 32,
    });

    assert.match(capturedSql, /\$1/);
    assert.match(capturedSql, /\$11/);
    assert.equal(capturedValues.length, 11);
  } finally {
    pool.query = originalQuery;
  }
});

test("getWaterById usa query parametrizada no SELECT por id", async () => {
  const originalQuery = pool.query;
  let capturedSql = "";
  let capturedValues = [];

  pool.query = async (sql, values) => {
    capturedSql = sql;
    capturedValues = values;
    return { rows: [] };
  };

  try {
    await waterModel.getWaterById(12);
    assert.match(capturedSql, /WHERE id = \$1/);
    assert.deepEqual(capturedValues, [12]);
  } finally {
    pool.query = originalQuery;
  }
});

test("getLast2hBuckets consulta janela de 2h e limita 4 buckets", async () => {
  const originalQuery = pool.query;
  let capturedSql = "";

  pool.query = async (sql) => {
    capturedSql = sql;
    return { rows: [{ bucket: "2026-04-20T10:00:00.000Z", wlevel: 40 }] };
  };

  try {
    const rows = await waterModel.getLast2hBuckets();
    assert.match(capturedSql, /INTERVAL '2 hours'/);
    assert.match(capturedSql, /LIMIT 4/);
    assert.deepEqual(rows, [{ hour: "2026-04-20T10:00:00.000Z", wlevel: 40 }]);
  } finally {
    pool.query = originalQuery;
  }
});
