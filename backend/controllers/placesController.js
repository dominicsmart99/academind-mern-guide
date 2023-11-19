const { validationResult } = require("express-validator");
const uuid = require("uuid").v4;

const HttpError = require("../models/httpError");
const getCoodsForAddress = require("../util/location");
const Place = require("../models/place");

async function getPlaceById(req, res, next) {
  let place;
  try {
    place = await Place.findById(req.params.pid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place.",
      500
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError(
      "No places found for the provided place id.",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
}

async function getUserPlaces(req, res, next) {
  let places;
  try {
    places = await Place.find({ creator: req.params.uid });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find places.",
      500
    );
    return next(error);
  }
  if (!places || places.length === 0) {
    const error = new HttpError(
      "No places found for the provided user id.",
      404
    );
    return next(error);
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
}

async function createPlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, image, address, creator } = req.body;
  let createdPlace;
  try {
    createdPlace = new Place({
      title,
      description,
      image,
      location: await getCoodsForAddress(address),
      address,
      creator,
    });
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
}

async function updatePlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, image, address } = req.body;

  let place;
  try {
    place = await Place.findByIdAndUpdate(
      req.params.pid,
      {
        title,
        description,
        location: await getCoodsForAddress(address),
        image,
        address,
      },
      { new: true }
    );
  } catch (err) {
    return next(err);
  }

  if (!place) {
    const error = new HttpError(
      "No places found for the provided place id.",
      404
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
}

async function deletePlace(req, res, next) {
  let place;
  try {
    place = await Place.findByIdAndDelete(req.params.pid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "No places found for the provided place id.",
      404
    );
    return next(error);
  }

  res.status(200).json({ message: "Place deleted successfully." });
}

exports.getPlaceById = getPlaceById;
exports.getUserPlaces = getUserPlaces;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
