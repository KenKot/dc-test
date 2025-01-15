const { test, describe } = require("node:test");
const assert = require("node:assert");

const {
  validateUpdateRoleRestrictions,
} = require("../../src/utils/validations/adminValidations");

describe("/adminValidations.js validators", () => {
  describe("validateUpdateRoleRestrictions", () => {
    test("should return invalid when input is missing", () => {
      const result = validateUpdateRoleRestrictions(
        null,
        "moderator",
        "member"
      );
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.message, "Invalid input for role validation");
    });

    test("should return invalid when a moderator tries to ban or promote another moderator/admin", () => {
      const result1 = validateUpdateRoleRestrictions(
        "moderator",
        "admin",
        "moderator"
      );
      assert.strictEqual(result1.isValid, false);
      assert.strictEqual(
        result1.message,
        "Moderators cannot ban or promote admins/moderators"
      );

      const result2 = validateUpdateRoleRestrictions(
        "moderator",
        "moderator",
        "moderator"
      );
      assert.strictEqual(result2.isValid, false);
      assert.strictEqual(
        result2.message,
        "Moderators cannot ban or promote admins/moderators"
      );

      const result3 = validateUpdateRoleRestrictions(
        "moderator",
        "member",
        "moderator"
      );
      assert.strictEqual(result3.isValid, false);
      assert.strictEqual(
        result3.message,
        "Moderators cannot ban or promote admins/moderators"
      );
    });

    test("should return invalid when an admin tries to demote or ban another admin", () => {
      const result = validateUpdateRoleRestrictions("admin", "admin", "member");
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(
        result.message,
        "Admins cannot demote or ban other admins."
      );
    });

    test("should return valid when no rules are violated", () => {
      const result1 = validateUpdateRoleRestrictions(
        "admin",
        "moderator",
        "member"
      );
      assert.strictEqual(result1.isValid, true);

      const result2 = validateUpdateRoleRestrictions(
        "moderator",
        "member",
        "member"
      );
      assert.strictEqual(result2.isValid, true);

      const result3 = validateUpdateRoleRestrictions(
        "admin",
        "member",
        "alumni"
      );
      assert.strictEqual(result3.isValid, true);
    });
  });
});
