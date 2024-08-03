/*
The code snippet below serves as a foundation for a basic weather endpoint that returns current weather data for a given city. Your task is to enhance this code by addressing the following areas:

1. Error Handling and User Experience: Implement robust error handling, providing clear and informative messages to users. Consider incorporating retry logic for API failures.
2. Data Validation and Input Sanitisation: Validate the input city parameter to ensure it's a valid string. Furthermore, implement input sanitisation to prevent potential security vulnerabilities.
3. Asynchronous Operations: Utilise promises or async/await to manage asynchronous operations, such as fetching weather data from an external API. Do not forget to handle potential errors and timeouts.
4. Caching: Implement a basic in-memory cache to store weather data temporarily. Explore the use of advanced caching libraries like `node-cache` or `redis` for production environments.
5. Unit Testing: Write comprehensive unit tests to cover various scenarios, including successful requests, invalid city names, API errors, and cache hits/misses.

```
const express = require('express');
const app = express();
const port = 3000;

const weatherData = {
  'New York': {
    temperature: 75,
    condition: 'Sunny'
  },
  'London': {
    temperature: 62,
    condition: 'Cloudy'
  }
};

app.get('/weather/:city', (req, res) => {
  const city = req.params.city;
  const cityData = weatherData[city];

  if (cityData) {
    res.json(cityData);
  } else {
    res.status(404).json({ error: 'City not found' });
  }
});

app.listen(port, () => {
  console.log(`Weather API listening on port ${port}`);
});

```

**Deliverables**

1. Code Implementation: Modify the provided code to incorporate the improvements outlined above.
2. Video Explanation: Create a video (under 5 minutes) explaining your code changes and the rationale behind your decisions. Assume a non-technical audience. Note: To create the video, you can use tools like [Loom](https://www.loom.com) or your preferred video recording software.
*/

require("dotenv").config();
const express = require("express");
const NodeCache = require("node-cache");

const CodedError = require("./errors");
const api = require("./api");
const utils = require("./utils");

const app = express();
const port = 3000;

// Cache with a TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

app.use((req, res, next) => {
  utils.logRequest(req);
  res.on("finish", () => {
    utils.logResponse(res);
  });
  next();
});

// Endpoint to get weather data for a given city
app.get("/weather/:city", async (req, res) => {
  try {
    const cityName = utils.sanitizeCityInput(req.params.city);
    const cacheKey = utils.cacheableKey(cityName);

    // Check if the data is in the cache
    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    // Fetch weather data from the external API
    const weatherData = await api.fetchWeatherData(cityName);

    // Store the result in the cache
    cache.set(cacheKey, weatherData);

    // Return the weather data
    res.status(200).json(weatherData);
  } catch (error) {
    if (error instanceof CodedError) {
      // Handle known errors with custom messages
      res.status(error.status).json({ code: error.code, error: error.message });
    } else {
      // Handle unexpected errors with a generic message
      res
        .status(500)
        .json({ code: "UNEXPECTED_ERROR", error: "Internal server error" });
    }
  }
});

// Error handling middleware for unhandled routes
app.use((req, res) => {
  res.status(404).json({ code: "API_NOT_FOUND", error: "Endpoint not found" });
});

const server = app.listen(port, () => {
  console.log(`Weather API listening on port ${port}...`);
});

module.exports = app;
module.exports.cache = cache;
module.exports.server = server;
