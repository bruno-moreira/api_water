import test from "node:test";
import assert from "node:assert/strict";
import { insertLimiter } from "./rateLimit.js";

const runLimiter = (req) =>
  new Promise((resolve) => {
    let responseStatus = 200;
    let responsePayload = null;
    const res = {
      setHeader: () => {},
      status(code) {
        responseStatus = code;
        return this;
      },
      json(body) {
        responsePayload = body;
        resolve({ limited: true, statusCode: responseStatus, payload: responsePayload });
        return this;
      },
      send(body) {
        responsePayload = body;
        resolve({ limited: true, statusCode: responseStatus, payload: responsePayload });
        return this;
      },
    };

    insertLimiter(req, res, () => {
      resolve({ limited: false, statusCode: responseStatus, payload: responsePayload });
    });
  });

test("insertLimiter bloqueia após exceder limite de requisições", async () => {
  const req = {
    ip: "127.0.0.1",
    method: "POST",
    originalUrl: "/api/nivel/",
    path: "/api/nivel/",
    headers: {},
    app: { get: () => false },
  };

  for (let i = 0; i < 100; i += 1) {
    const result = await runLimiter(req);
    assert.equal(result.limited, false);
  }

  const limitedResult = await runLimiter(req);
  assert.equal(limitedResult.statusCode, 429);
  assert.deepEqual(limitedResult.payload, {
    error: "Muitas requisições de inserção. Tente novamente em alguns minutos.",
  });
});
