import test from "node:test";
import assert from "node:assert/strict";
import { decodeStateBits } from "./waterService.js";

test("decodeStateBits deve decodificar flags de bomba corretamente", () => {
  const decoded = decodeStateBits(32);

  assert.equal(decoded.pump1, false);
  assert.equal(decoded.pump2, true);
  assert.equal(decoded.protect_pump1, false);
  assert.equal(decoded.protect_pump2, false);
  assert.equal(decoded.a1_contact_pump1, false);
  assert.equal(decoded.a1_contact_pump2, false);
});

test("decodeStateBits deve refletir múltiplos bits ativos", () => {
  const decoded = decodeStateBits(220);

  assert.equal(decoded.pump1, true); // bit 4
  assert.equal(decoded.pump2, false); // bit 5
  assert.equal(decoded.protect_pump1, true); // bit 6
  assert.equal(decoded.protect_pump2, true); // bit 7
  assert.equal(decoded.a1_contact_pump1, true); // bit 2
  assert.equal(decoded.a1_contact_pump2, true); // bit 3
});
