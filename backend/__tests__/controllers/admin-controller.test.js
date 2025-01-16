const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../src/app");

const api = supertest(app);

const User = require("../../src/models/user");
const { JWT_SECRET } = require("../../src/config/envConfig");

const jwt = require("jsonwebtoken");

beforeEach(async () => {
  await User.deleteMany({});

  let users = [
    {
      firstname: "David",
      lastname: "Davidson",
      email: "fakedavid@example.com",
      isVerified: true,
      role: "admin",
      password: "randomPassword123",
    },
    {
      firstname: "Oscar",
      lastname: "Oscarson",
      email: "fakeoscar@example.com",
      isVerified: true,
      role: "moderator",
      password: "randomPassword123",
    },
    {
      firstname: "Jimbo",
      lastname: "jimmy",
      email: "fakejimbo@example.com",
      isVerified: false,
      role: "member",
      password: "randomPassword123",
    },
    {
      firstname: "Rachel",
      lastname: "Rachelson",
      email: "fakerachel@example.com",
      isVerified: true,
      role: "member",
      password: "randomPassword123",
    },
    {
      firstname: "Lily",
      lastname: "Lilyson",
      email: "fakeklily@example.com",
      isVerified: true,
      role: "alumni",
      password: "randomPassword123",
    },
    {
      firstname: "John",
      lastname: "Johnson",
      email: "fakejohn@example.com",
      isVerified: true,
      role: "pending",
      password: "randomPassword123",
    },
    {
      firstname: "Frank",
      lastname: "Frankson",
      email: "fakefrank@example.com",
      isVerified: true,
      role: "banned",
      password: "randomPassword123",
    },
  ];

  for (let user of users) {
    let newUser = new User({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      password: user.password,
    });

    await newUser.save();
  }
});

test("Admin can ban a user with a reason", async () => {
  const admin = await User.findOne({ role: "admin" });
  const userToBan = await User.findOne({ role: "member" });
  const adminToken = jwt.sign({ id: admin._id }, JWT_SECRET, {
    expiresIn: "14d",
  });

  const response = await api
    .post("/api/admin/update-role")
    .set("Cookie", [`token=${adminToken}`])
    .send({
      userIdToUpdate: userToBan._id,
      newRole: "banned",
      banReason: "Violation of rules",
    });

  assert.strictEqual(response.body.success, true);
  assert.strictEqual(
    response.body.message,
    "User's role successfully updated to banned"
  );

  const updatedUser = await User.findById(userToBan._id);
  assert.strictEqual(updatedUser.role, "banned");
  assert.strictEqual(updatedUser.banDetails.reason, "Violation of rules");
});

test("Admin can ban a user without a reason", async () => {
  const admin = await User.findOne({ role: "admin" });
  const userToBan = await User.findOne({ role: "member" });
  const adminToken = jwt.sign({ id: admin._id }, JWT_SECRET, {
    expiresIn: "14d",
  });

  const response = await api
    .post("/api/admin/update-role")
    .set("Cookie", [`token=${adminToken}`])
    .send({
      userIdToUpdate: userToBan._id,
      newRole: "banned",
    });

  assert.strictEqual(response.body.success, true);
  assert.strictEqual(
    response.body.message,
    "User's role successfully updated to banned"
  );

  const updatedUser = await User.findById(userToBan._id);
  assert.strictEqual(updatedUser.role, "banned");
  assert.strictEqual(updatedUser.banDetails.reason, "No reason specified");
});

test("Admin can unban a user and change role to member", async () => {
  const admin = await User.findOne({ role: "admin" });
  const userToUnban = await User.findOne({ role: "banned" });
  const adminToken = jwt.sign({ id: admin._id }, JWT_SECRET, {
    expiresIn: "14d",
  });

  const response = await api
    .post("/api/admin/update-role")
    .set("Cookie", [`token=${adminToken}`])
    .send({
      userIdToUpdate: userToUnban._id,
      newRole: "member",
    });

  assert.strictEqual(response.body.success, true);
  assert.strictEqual(
    response.body.message,
    "User's role successfully updated to member"
  );

  const updatedUser = await User.findById(userToUnban._id);

  assert.strictEqual(updatedUser.role, "member");
});

after(async () => {
  await mongoose.connection.close();
});
