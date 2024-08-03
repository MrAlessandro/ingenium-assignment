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

  const minLength = 2; // Minimum length of city name
  const maxLength = 100; // Maximum length of city name
  let sanitizedCity = city.trim();
  /*
      [A-Za-zÀ-ÖØ-öø-ÿ]+: Matches one or more alphabetic characters, including accented characters commonly found in city names.
      (?:[\s-][A-Za-zÀ-ÖØ-öø-ÿ]+)*: A non-capturing group that matches additional words or parts of the city name, allowing for spaces or hyphens between them.
      [\s-]: Matches a space or hyphen.
      [A-Za-zÀ-ÖØ-öø-ÿ]+: Matches one or more alphabetic characters after the space or hyphen.
    */
  const cityNamePattern = new RegExp(
    "^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\\s-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$"
  );

  // Check if the city name contains only letters, spaces, and accented characters
  if (
    sanitizedCity.length < minLength ||
    sanitizedCity.length > maxLength ||
    !cityNamePattern.test(sanitizedCity)
  ) {
    let error = new Error("Invalid city name");
    error.status = 400;
    throw error;
  }

  return sanitizedCity;
};

module.exports = {
  cacheableKey,
  sanitizeCityInput,
};
