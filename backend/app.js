const bodyParser = require("body-parser");
const express = require("express");
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

app.listen(5000);
