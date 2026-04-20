import test from "node:test";
import assert from "node:assert/strict";
import errorHandler from "./errorHandler.js";
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

test("errorHandler retorna erro de negócio com status definido", () => {
  const err = new HttpError(400, "Campos obrigatórios ausentes");
  const res = createResponseMock();

  errorHandler(err, {}, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, { error: "Campos obrigatórios ausentes" });
});

test("errorHandler mascara erro interno com status 500", () => {
  const err = new Error("falha interna");
  const res = createResponseMock();

  errorHandler(err, {}, res, () => {});

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.payload, { error: "Erro interno do servidor" });
});
