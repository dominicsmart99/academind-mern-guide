const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const HttpError = require("../models/httpError");
const getCoodsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const user = require("../models/user");

async function getPlaceById(req, res, next) {
  let place;
  try {
    place = await Place.findById(req.params.pid);
  } catch (error) {
    // const error = new HttpError(
    //   "Something went wrong, could not find place.",
    //   500
    // );
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
  } catch (error) {
    // const error = new HttpError(
    //   "Something went wrong, could not find places.",
    //   500
    // );
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

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return next(new HttpError("No user found matching creator Id.", 422));
  }

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

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    // const error = new HttpError(
    //   "Creating place failed, please try again.",
    //   500
    // );
    return next(error);
  }
  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
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
  } catch (error) {
    return next(error);
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
    const sess = await mongoose.startSession();
    sess.startTransaction();
    place = await Place.findByIdAndDelete(req.params.pid, { session: sess });

    if (!place) {
      const error = new HttpError(
        "No places found for the provided place id.",
        404
      );
      return next(error);
    }

    const user = await User.findById(place.creator);

    if (!user) {
      const error = new HttpError("Creator could not be found.", 404);
      return next(error);
    }

    user.places.pull(place);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    // const error = new HttpError(
    //   "Something went wrong, could not delete place.",
    //   500
    // );
    return next(error);
  }

  res.status(200).json({ message: "Place deleted successfully." });
}

exports.getPlaceById = getPlaceById;
exports.getUserPlaces = getUserPlaces;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
