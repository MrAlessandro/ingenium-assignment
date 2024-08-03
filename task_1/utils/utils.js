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
    let error = new Error("City name must be a string");
    error.status = 400;
    throw error;
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
    let error = new Error("Invalid city name length");
    error.status = 400;
    throw error;
  }

  return sanitizedCity;
};

module.exports = {
  cacheableKey,
  sanitizeCityInput,
};
