const CodedError = require("./errors");

// Slugify a string
const cacheableKey = (str) =>
  String(str)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens

const sanitizeCityInput = (city) => {
  if (typeof city !== "string") {
    throw new CodedError("INVALID_CITY", 400, "Invalid city name");
  }

  /*
  a-zA-Z: matches any letter from a to z, both lowercase and uppercase
  \s: matches any whitespace character, including spaces and tabs
  \u00C0-\u024F: Include most accented characters
  */
  let sanitizedCity = city
    .normalize("NFD")
    .replace(/[^a-zA-Z\s\u00C0-\u024F'-]/g, "")
    .trim();

  const minLength = 2; // Minimum length of city name
  const maxLength = 100; // Maximum length of city name
  if (sanitizedCity.length < minLength || sanitizedCity.length > maxLength) {
    throw new CodedError("INVALID_CITY", 400, "Invalid city name length");
  }

  return sanitizedCity;
};

const logRequest = (req) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method.toUpperCase()} ${req.url}`);
};

const logResponse = (res) => {
  console.log(`\t${res.statusCode} - ${res.statusMessage}`);
};

module.exports = {
  cacheableKey,
  sanitizeCityInput,
  logRequest,
  logResponse,
};
