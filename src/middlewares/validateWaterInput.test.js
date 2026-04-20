import test from "node:test";
import assert from "node:assert/strict";
import { validateCreateWater } from "./validateWaterInput.js";

const createResponseMock = () => {
  const res = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
  return res;
};

test("validateCreateWater aceita payload válido", () => {
  const req = { body: { wlevel: 50, state: 32, pump_aux: true, wvol: 1000 } };
  const res = createResponseMock();
  let nextCalled = false;

  validateCreateWater(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(req.body, { wlevel: 50, state: 32, pump_aux: true, wvol: 1000 });
});

test("validateCreateWater rejeita wlevel fora do intervalo 0-100", () => {
  const req = { body: { wlevel: 101, state: 32 } };
  const res = createResponseMock();
  let nextCalled = false;

  validateCreateWater(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.error, "Payload inválido");
});

test("validateCreateWater rejeita state não inteiro", () => {
  const req = { body: { wlevel: 70, state: 1.2 } };
  const res = createResponseMock();
  let nextCalled = false;

  validateCreateWater(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.error, "Payload inválido");
});
