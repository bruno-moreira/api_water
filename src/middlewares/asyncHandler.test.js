import test from "node:test";
import assert from "node:assert/strict";
import asyncHandler from "./asyncHandler.js";

test("asyncHandler encaminha erro assíncrono para next", async () => {
  const expectedError = new Error("boom");
  const wrapped = asyncHandler(async () => {
    throw expectedError;
  });

  let capturedError = null;
  wrapped({}, {}, (err) => {
    capturedError = err;
  });

  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(capturedError, expectedError);
});
