import test from "node:test";
import assert from "node:assert/strict";
import WaterApiClient from "./WaterApiClient.js";

test("createOne envia payload correto", async () => {
  const calls = [];
  const transport = {
    async post(url, payload) {
      calls.push({ url, payload });
      return { data: { id: 1, ...payload } };
    },
  };

  const client = new WaterApiClient({ transport });
  const created = await client.createOne({ wlevel: 45, state: 32, pump_aux: true, wvol: 700 });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/nivel/");
  assert.deepEqual(calls[0].payload, { wlevel: 45, state: 32, pump_aux: true, wvol: 700 });
  assert.equal(created.id, 1);
});

test("createMany processa lote e devolve resumo", async () => {
  const transport = {
    async post(_url, payload) {
      if (payload.wlevel > 100) {
        const error = new Error("bad request");
        error.response = { data: { error: "Payload inválido" } };
        throw error;
      }
      return { data: { id: payload.wlevel, ...payload } };
    },
  };

  const client = new WaterApiClient({ transport });
  const summary = await client.createMany(
    [
      { wlevel: 10, state: 32 },
      { wlevel: 150, state: 32 },
      { wlevel: 20, state: 32 },
    ],
    { concurrency: 2, continueOnError: true },
  );

  assert.equal(summary.total, 3);
  assert.equal(summary.success, 2);
  assert.equal(summary.failed, 1);
  assert.equal(summary.errors[0].message, "Payload inválido");
});
