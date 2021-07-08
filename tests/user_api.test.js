const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
});

describe("New User Creation", () => {
  test("creation succeeds with a new username", async () => {
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "password",
    };

    await api.post("/api/users").send(newUser).expect(200);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("no duplicate users", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "nick",
      name: "nick test",
      password: "test",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
    expect(response.body.error).toContain("`username` to be unique");
  });
  test("error when <3 username chars", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "ml",
      name: "Matti Luukkainen",
      password: "password",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
    expect(response.body.error).toContain("Username is too short");
  });

  test("error when <3 password chars", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "mluu",
      name: "Matti Luukkainen",
      password: "pa",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
    expect(response.body.error).toContain("Password is too short");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
