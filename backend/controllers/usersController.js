const { validationResult } = require("express-validator");

const HttpError = require("../models/httpError");
const User = require("../models/user");

async function getAllUsers(req, res, next) {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    // const error = new HttpError(
    //   "Something went wrong, could not find users.",
    //   500
    // );
    return next(error);
  }
  if (!users || users.length === 0) {
    const error = new HttpError("No users found.", 404);
    return next(error);
  }
  res.json({
    users: users.map((users) => users.toObject({ getters: true })),
  });
}

async function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(error);
  }
  if (existingUser) {
    return next(new HttpError("Account already exists with this email.", 422));
  }
  const newUser = new User({
    name,
    email,
    password,
    image:
      "https://qph.cf2.quoracdn.net/main-qimg-8e770f980f1b1f0a1a33fa01ec29ec56-lq",
    places: [],
  });
  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ user: newUser.toObject({ getters: true }) });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email, password: password });
  } catch (err) {
    // const error = new HttpError(
    //   "Login failed, please try again.",
    //   500
    // );
    return next(err);
  }

  if (!user) {
    return next(
      new HttpError("No account found matching email and password.", 404)
    );
  }

  res.status(200).json({ message: `Login successful as ${user.name}.` });
}

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
