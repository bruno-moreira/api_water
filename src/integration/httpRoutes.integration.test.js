import test from "node:test";
import assert from "node:assert/strict";
import createApp from "../app.js";
import waterModel from "../model/waterModel.js";
import waterService from "../services/waterService.js";

const startTestServer = async () => {
  const app = createApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  return {
    baseUrl,
    close: async () => {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    },
  };
};

test("GET /api/nivel retorna 200 com lista de registros", async () => {
  const original = waterModel.getAllWater;
  waterModel.getAllWater = async () => [{ id: 1, wlevel: 42 }];

  const { baseUrl, close } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/nivel/`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, [{ id: 1, wlevel: 42 }]);
  } finally {
    waterModel.getAllWater = original;
    await close();
  }
});

test("POST /api/nivel rejeita payload inválido com status 400", async () => {
  const { baseUrl, close } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/nivel/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wlevel: 200, state: 32 }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "Payload inválido");
  } finally {
    await close();
  }
});

test("POST /api/nivel aceita payload válido e retorna 201", async () => {
  const original = waterService.verificaWater;
  const expected = { id: 2, wlevel: 60, state: 32 };
  waterService.verificaWater = async () => expected;

  const { baseUrl, close } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/nivel/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wlevel: 60, state: 32, pump_aux: true }),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.deepEqual(body, expected);
  } finally {
    waterService.verificaWater = original;
    await close();
  }
});

test("GET /api/nivel/:id retorna 404 quando não encontra registro", async () => {
  const original = waterModel.getWaterById;
  waterModel.getWaterById = async () => null;

  const { baseUrl, close } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/nivel/999`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error, "Não encontrada");
  } finally {
    waterModel.getWaterById = original;
    await close();
  }
});

test("GET /api/nivel/last2h retorna buckets com status 200", async () => {
  const original = waterModel.getLast2hBuckets;
  const expected = [
    { hour: "2026-04-20T10:00:00.000Z", wlevel: 40 },
    { hour: "2026-04-20T10:30:00.000Z", wlevel: 43 },
  ];
  waterModel.getLast2hBuckets = async () => expected;

  const { baseUrl, close } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/api/nivel/last2h`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, expected);
  } finally {
    waterModel.getLast2hBuckets = original;
    await close();
  }
});

test("GET /docs responde com status 200", async () => {
  const { baseUrl, close } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/docs`);
    const text = await response.text();

    assert.equal(response.status, 200);
    assert.match(text, /Swagger UI/i);
  } finally {
    await close();
  }
});
