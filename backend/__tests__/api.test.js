const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/app");

const api = supertest(app);

const User = require("../src/models/user");

beforeEach(async () => {
  await User.deleteMany({});

  let users = [
    {
      firstname: "David",
      lastname: "Davidson",
      email: "david@example.com",
      isVerified: true,
      role: "admin",
      password: "randomPassword123",
    },
    {
      firstname: "Oscar",
      lastname: "Oscarson",
      email: "oscar@example.com",
      isVerified: true,
      role: "moderator",
      password: "randomPassword123",
    },
    {
      firstname: "Jimbo",
      lastname: "jimmy",
      email: "jim@example.com",
      isVerified: false,
      role: "member",
      password: "randomPassword123",
    },
    {
      firstname: "Rachel",
      lastname: "Rachelson",
      email: "rachel@example.com",
      isVerified: true,
      role: "member",
      password: "randomPassword123",
    },
    {
      firstname: "Lily",
      lastname: "Lilyson",
      email: "lily@example.com",
      isVerified: true,
      role: "alumni",
      password: "randomPassword123",
    },
    {
      firstname: "John",
      lastname: "Johnson",
      email: "john@example.com",
      isVerified: true,
      role: "pending",
      password: "randomPassword123",
    },
    {
      firstname: "Frank",
      lastname: "Frankson",
      email: "frank@example.com",
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

test("notes are returned as json", async () => {
  const response = await api
    .get("/api/profiles")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  // Check the 'success' field value
  assert.strictEqual(response.body.success, true);

  // Check the 'message' field value
  assert.strictEqual(
    response.body.message,
    "All active users returned successfully"
  );
});

after(async () => {
  await mongoose.connection.close();
});
