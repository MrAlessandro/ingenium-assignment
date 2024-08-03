require("dotenv").config();

var express = require("express");
var router = express.Router();

const axios = require("axios");
const axiosRetry = require("axios-retry").default;
const utils = require("../utils/utils");
const cache = require("../cache");

// Configure axios to use axios-retry
axiosRetry(axios, {
  retries: 3, // Number of retries
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Time between retries in milliseconds
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response.status >= 500
    );
  },
});

const fetchWeatherData = async (city, timeout = 9000) => {
  let error;
  let response;
  try {
    response = await axios({
      method: "get",
      url: `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`,
      timeout: timeout, // overall timeout for all retries
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  } catch (e) {
    // Handle timeout error
    if (e instanceof axios.AxiosError && e.code === "ECONNABORTED") {
      error = new Error(
        "Weather data unavailable at the moment. Please try again later."
      );
      error.status = 504;
    } else if (e.response.data.error) {
      /*
       * From WheatherAPI documentation:
       * Status code: "401" - Error code: "1002" -> "API key not provided."
       * Status code: "400" - Error code: "1003" -> "Parameter 'q' not provided."
       * Status code: "400" - Error code: "1005" -> "API request url is invalid"
       * Status code: "400" - Error code: "1006" -> "No location found matching parameter 'q'"
       * Status code: "401" - Error code: "2006" -> "API key provided is invalid"
       * Status code: "403" - Error code: "2007" -> "API key has exceeded calls per month quota."
       * Status code: "403" - Error code: "2008" -> "API key has been disabled."
       * Status code: "403" - Error code: "2009" -> "API key does not have access to the resource. Please check pricing page for what is allowed in your API subscription plan."
       * Status code: "400" - Error code: "9000" -> "Json body passed in bulk request is invalid. Please make sure it is valid json with utf-8 encoding."
       * Status code: "400" - Error code: "9001" -> "Json body contains too many locations for bulk request. Please keep it below 50 in a single request."
       * Status code: "400" - Error code: "9999" -> "Internal application error."
       */
      switch (e.response.data.error.code) {
        case 1005:
        case 2006:
        case 2007:
        case 2008:
        case 2009:
        case 9999:
          error = new Error(
            "Weather data unavailable at the moment. Please try again later."
          );
          error.status = 500;
          break;
        case 1006:
          error = new Error("City requested not found");
          error.status = 404;
          break;
        default:
          error = new Error(
            "Something went wrong during elaboration of the request"
          );
          error.status = 500;
      }
    } else {
      // Handle other errors
      error = new Error(
        "Something went wrong during elaboration of the request"
      );
      error.status = 500;
    }
  }
  if (error) {
    throw error;
  }

  const { temp_c, condition, humidity, wind_kph, uv } = response.data.current;
  if (!temp_c || !condition?.text || !humidity || !wind_kph || !uv) {
    error = new Error("Something went wrong during elaboration of the request");
    error.status = 500;
    throw error;
  }

  return {
    temperature: temp_c,
    condition: condition.text,
    humidity,
    wind: wind_kph,
    uv,
  };
};

// Endpoint to get weather data for a given city
router.get("/weather/:city", async (req, res, next) => {
  try {
    const cityName = utils.sanitizeCityInput(req.params.city);
    const cacheKey = utils.cacheableKey(cityName);

    // Check if the data is in the cache
    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    // Fetch weather data from the external API
    const weatherData = await fetchWeatherData(cityName);

    // Store the result in the cache
    cache.set(cacheKey, weatherData);

    // Return the weather data
    res.status(200).json(weatherData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
