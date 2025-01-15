const { test, describe } = require("node:test");
const assert = require("node:assert");

const generateToken = require("../src/utils/generateToken");

describe("/utils helper functions", () => {
  describe("generateToken.js", () => {
    test("generates 6 char, random token", () => {
      const token1 = generateToken();
      const token2 = generateToken();

      assert.strictEqual(token1.length, 6);
      assert.notStrictEqual(token1, token2);
    });
  });
});
