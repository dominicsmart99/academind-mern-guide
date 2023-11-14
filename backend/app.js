const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const HttpError = require("./models/httpError");

const placesRoutes = require("./routes/placesRoutes");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  return next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error has occurred. :(" });
});

mongoose
  .connect(
    `mongodb+srv://${dotenv.parsed.MONGO_DB_NAME}:${dotenv.parsed.MONGO_DB_PW}@cluster0.v5txoph.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
