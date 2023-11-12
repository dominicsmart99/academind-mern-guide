const axios = require("axios");
const dotenv = require("dotenv").config();
const HttpError = require("../models/httpError");

async function getCoodsForAddress(address) {
  address = encodeURIComponent(address);
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${dotenv.parsed.GOOGLE_API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "REQUEST_DENIED") {
    const error = new HttpError(data.error_message, 500);
    throw error;
  }

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("Could not find specified address.", 500);
    throw error;
  }
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoodsForAddress;
