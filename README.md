The code snippet below serves as a foundation for a basic weather endpoint that returns current weather data for a given city. Your task is to enhance this code by addressing the following areas:

1. Error Handling and User Experience: Implement robust error handling, providing clear and informative messages to users. Consider incorporating retry logic for API failures.
2. Data Validation and Input Sanitisation: Validate the input city parameter to ensure it's a valid string. Furthermore, implement input sanitisation to prevent potential security vulnerabilities.
3. Asynchronous Operations: Utilise promises or async/await to manage asynchronous operations, such as fetching weather data from an external API. Do not forget to handle potential errors and timeouts.
4. Caching: Implement a basic in-memory cache to store weather data temporarily. Explore the use of advanced caching libraries like `node-cache` or `redis` for production environments.
5. Unit Testing: Write comprehensive unit tests to cover various scenarios, including successful requests, invalid city names, API errors, and cache hits/misses.

```javascript
const express = require("express");
const app = express();
const port = 3000;

const weatherData = {
  "New York": {
    temperature: 75,
    condition: "Sunny",
  },
  London: {
    temperature: 62,
    condition: "Cloudy",
  },
};

app.get("/weather/:city", (req, res) => {
  const city = req.params.city;
  const cityData = weatherData[city];

  if (cityData) {
    res.json(cityData);
  } else {
    res.status(404).json({ error: "City not found" });
  }
});

app.listen(port, () => {
  console.log(`Weather API listening on port ${port}`);
});
```

**Deliverables**

1. Code Implementation: Modify the provided code to incorporate the improvements outlined above.
2. Video Explanation: Create a video (under 5 minutes) explaining your code changes and the rationale behind your decisions. Assume a non-technical audience. Note: To create the video, you can use tools like [Loom](https://www.loom.com) or your preferred video recording software.
