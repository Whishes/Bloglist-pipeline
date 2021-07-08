const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  // got rid of username check as the model should be sufficient whereas password needs extra security
  if (!body.password || body.password === "") {
    return response.status(400).json({ error: "Password is required" });
  }

  if (body.password.length < 3) {
    return response.status(400).json({ error: "Password is too short" });
  }

  if (body.username.length < 3) {
    return response.status(400).json({ error: "Username is too short" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    // url instead of user
    url: 1,
    title: 1,
    // author instead of likes
    author: 1,
  });

  response.json(users.map((u) => u.toJSON()));
});

module.exports = usersRouter;
