require("dotenv").config();
const CodedError = require("./errors");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;

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
  try {
    const response = await axios({
      method: "get",
      url: `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`,
      timeout: timeout, // overall timeout for all retries
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const { temp_c, condition, humidity, wind_kph, uv } = response.data.current;
    if (!temp_c || !condition?.text || !humidity || !wind_kph || !uv) {
      throw new CodedError(
        CodedError.API_ERROR,
        500,
        "Something went wrong during elaboration of the request"
      );
    }

    let data = {
      temperature: temp_c,
      condition: condition.text,
      humidity,
      wind: wind_kph,
      uv,
    };
    return data;
  } catch (error) {
    if (error instanceof CodedError) {
      // Re-throw known errors
      throw error;
    }
    // Handle timeout error
    if (error instanceof axios.AxiosError && error.code === "ECONNABORTED") {
      throw new CodedError(
        CodedError.EXT_API_ERROR,
        500,
        "Weather data unavailable at the moment. Please try again later.",
        error.message
      );
    }
    if (error.response.data.error) {
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
      switch (error.response.data.error.code) {
        case 1005:
        case 2006:
        case 2007:
        case 2008:
        case 2009:
        case 9999:
          throw new CodedError(
            CodedError.EXT_API_ERROR,
            500,
            "Weather data unavailable at the moment. Please try again later.",
            error.message
          );
        case 1006:
          throw new CodedError(
            CodedError.CITY_NOT_FOUND,
            404,
            "City requested not found",
            error.message
          );
        case 9000:
        case 9001:
        case 1003:
        case 1002:
        default:
          throw new CodedError(
            CodedError.API_ERROR,
            500,
            "Something went wrong during elaboration of the request",
            error.message
          );
      }
    }
    // Handle other errors
    throw new CodedError(
      CodedError.API_ERROR,
      500,
      "Something went wrong during elaboration of the request",
      error.message
    );
  }
};

module.exports = {
  fetchWeatherData,
};
