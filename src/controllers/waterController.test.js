import test from "node:test";
import assert from "node:assert/strict";
import waterController from "./waterController.js";
import waterService from "../services/waterService.js";
import waterModel from "../model/waterModel.js";
import HttpError from "../utils/HttpError.js";

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

test("createWater delega para service e retorna 201", async () => {
  const original = waterService.verificaWater;
  const expected = { id: 1, wlevel: 50, state: 32 };
  waterService.verificaWater = async () => expected;

  try {
    const req = { body: { wlevel: 50, state: 32 } };
    const res = createResponseMock();
    await waterController.createWater(req, res);

    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.payload, expected);
  } finally {
    waterService.verificaWater = original;
  }
});

test("createWaterQuery lança HttpError quando faltam campos", async () => {
  const req = { query: {} };
  const res = createResponseMock();

  await assert.rejects(
    () => waterController.createWaterQuery(req, res),
    (error) => {
      assert.equal(error instanceof HttpError, true);
      assert.equal(error.statusCode, 400);
      return true;
    }
  );
});

test("getWaterById lança 404 quando não encontra registro", async () => {
  const original = waterModel.getWaterById;
  waterModel.getWaterById = async () => null;

  try {
    const req = { params: { id: "10" } };
    const res = createResponseMock();

    await assert.rejects(
      () => waterController.getWaterById(req, res),
      (error) => {
        assert.equal(error instanceof HttpError, true);
        assert.equal(error.statusCode, 404);
        return true;
      }
    );
  } finally {
    waterModel.getWaterById = original;
  }
});
