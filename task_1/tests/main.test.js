const request = require("supertest");
const axios = require("axios");
const app = require("../src/main");
const utils = require("../src/utils");
const cache = app.cache;
const server = app.server;

jest.mock("axios");

describe("Weather API", () => {
  afterEach(() => {
    jest.clearAllMocks();
    // reset the cache after each test
    cache.flushAll();
  });

  afterAll(() => {
    server.close();
  });

  it("should return weather data for a valid city", async () => {
    axios.mockImplementation(() =>
      Promise.resolve({
        data: {
          current: {
            temp_c: 75,
            condition: { text: "Sunny" },
            humidity: 50,
            wind_kph: 10,
            uv: 5,
          },
        },
      })
    );

    const response = await request(app).get("/weather/New York");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      temperature: 75,
      condition: "Sunny",
      humidity: 50,
      wind: 10,
      uv: 5,
    });
  });

  it("should return 404 error for an invalid city", async () => {
    // Mocking the API response to simulate a city not found scenario
    axios.mockImplementation(() =>
      Promise.reject({
        response: {
          status: 404,
          data: {
            error: { code: 1006, message: "No matching location found." },
          },
        },
      })
    );

    const response = await request(app).get("/weather/Invalid City");
    console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "CITY_NOT_FOUND",
      error: "City requested not found",
    });
  });

  it("should hit cache", async () => {
    const cityName = "London";
    const cacheKey = utils.cacheableKey(cityName);
    const weatherData = {
      temperature: 70,
      condition: "Cloudy",
      humidity: 60,
      wind: 5,
      uv: 3,
    };
    // Store the result in the cache
    cache.set(cacheKey, weatherData);

    const response = await request(app).get(`/weather/${cityName}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(weatherData);
  });

  it("should handle external API errors", async () => {
    // Mocking the API response to simulate an API error
    axios.mockImplementation(() =>
      Promise.reject({
        response: {
          status: 403,
          data: {
            error: {
              code: 2007,
              message: "API key has exceeded calls per month quota.",
            },
          },
        },
      })
    );

    const response = await request(app).get("/weather/London");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: "EXT_API_ERROR",
      error: "Weather data unavailable at the moment. Please try again later.",
    });
  });
});
