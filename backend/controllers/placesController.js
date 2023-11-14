const { validationResult } = require("express-validator");
const uuid = require("uuid").v4;

const HttpError = require("../models/httpError");
const getCoodsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "A famous sky scraper",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9882393,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Harry Potter: The Exhibition New York City",
    description: "Experience the wonder of Harry Potter.",
    imageUrl:
      "https://offloadmedia.feverup.com/secretnyc.co/wp-content/uploads/2022/02/23134545/immersive-harry-potter-experience-less-than-two-hours-nyc.png",
    address: "50 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7496281,
      lng: -73.9872714,
    },
    creator: "u2",
  },
];

function getPlaceById(req, res, next) {
  const place = DUMMY_PLACES.find((p) => p.id === req.params.pid);
  if (!place) {
    return next(new HttpError("No places found for the provided id.", 404));
  }
  res.json(place);
}

function getUserPlaces(req, res, next) {
  const user = DUMMY_PLACES.filter((p) => p.creator === req.params.uid);
  if (!user) {
    return next(
      new HttpError("No places found for the provided user id.", 404)
    );
  }
  res.json(user);
}

async function createPlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, image, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoodsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    image,
    location: coordinates,
    address,
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place filed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
}

function updatePlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === req.params.pid) };
  if (!updatedPlace) {
    return next(new HttpError("No places found for the provided id.", 404));
  }
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[DUMMY_PLACES.findIndex((p) => p.id === req.params.pid)] =
    updatedPlace;

  res.status(200).json({ place: updatedPlace });
}

function deletePlace(req, res, next) {
  if (!DUMMY_PLACES.find((p) => p.id === req.params.pid)) {
    return next(new HttpError("No places found for the provided id.", 404));
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== req.params.pid);
  res.status(200).json({ message: "Place deleted successfully." });
}

exports.getPlaceById = getPlaceById;
exports.getUserPlaces = getUserPlaces;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
