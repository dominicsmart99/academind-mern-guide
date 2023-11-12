const { validationResult } = require("express-validator");
const uuid = require("uuid").v4;

const HttpError = require("../models/httpError");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Papazuki",
    email: "papazuki@test.com",
    image:
      "https://qph.cf2.quoracdn.net/main-qimg-8e770f980f1b1f0a1a33fa01ec29ec56-lq",
    password: "testu1",
    places: 1,
  },
  {
    id: "u2",
    name: "Wogard",
    email: "wogard@test.com",
    image: "https://static.zerochan.net/Bogard.full.3906865.jpg",
    password: "testu2",
    places: 1,
  },
];

function getAllUsers(req, res, next) {
  res.json({ users: DUMMY_USERS });
}

function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;
  const existingUser = DUMMY_USERS.find((u) => u.email === email);
  if (existingUser) {
    return next(new HttpError("Account already exists with this email.", 422));
  }
  const newUser = {
    id: uuid(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(newUser);
  res.status(201).json({ user: newUser });
}

function login(req, res, next) {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) {
    return next(
      new HttpError("No account found matching email and password.", 404)
    );
  }

  res.status(200).json({ message: "Login successful." });
}

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
