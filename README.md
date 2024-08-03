# Ingenius assignment

## **Instructions**

1. **Please complete the assessment within 5 working days.** Time estimations are given for each task. If it’s taking you longer, you are probably overthinking it 🧐. Tips:
   - Be sure to read the instructions for each question carefully.
   - If you get stuck on a question, you can always ask us for help.
2. **45 to 60 minutes Q&A follow-up meeting with the team:** this will allow you to clarify any questions we might have and get to know the team.

We're looking forward to catching up with you soon!

## Tasks

### **1. [2 hours] The JavaScript Wizard!**

By completing this challenge, we expect that we will be able to capture a glimpse of your JavaScript proficiency, API development, error handling, data validation, asynchronous programming, caching, and unit testing.

The code snippet below serves as a foundation for a basic weather endpoint that returns current weather data for a given city. Your task is to enhance this code by addressing the following areas:

1. Error Handling and User Experience: Implement robust error handling, providing clear and informative messages to users. Consider incorporating retry logic for API failures.
2. Data Validation and Input Sanitisation: Validate the input city parameter to ensure it's a valid string. Furthermore, implement input sanitisation to prevent potential security vulnerabilities.
3. Asynchronous Operations: Utilise promises or async/await to manage asynchronous operations, such as fetching weather data from an external API. Do not forget to handle potential errors and timeouts.
4. Caching: Implement a basic in-memory cache to store weather data temporarily. Explore the use of advanced caching libraries like `node-cache` or `redis` for production environments.
5. Unit Testing: Write comprehensive unit tests to cover various scenarios, including successful requests, invalid city names, API errors, and cache hits/misses.

```jsx
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

**Additional Considerations**

- Feel free to restructure the code or introduce additional features as needed.
- Provide clear and concise code comments to enhance readability.
- Consider performance optimisations and best practices for production environments.
- Demonstrate your ability to write clean, maintainable, and well-structured code.

### **2. [2 hours] The Hiring Manager!**

Assuming you are the Hiring Manager responsible for recruiting a full-stack engineer, you have been assigned the task of creating a technical assessment to evaluate the candidate's technical proficiency.

1. What hands-on technical question would you come up with to assess the candidate's technical expertise?
2. Once you are done with the tech question, prepare a possible solution that you would be happy to receive from the candidate.

As a guideline, your technical question and solution need to be well different from the first question and it should cover at least the following 3 topics:

- Code quality, structure, efficiency and testing coverage
- Application scalability and performance
- Communication skills and ability to explain technical concepts clearly

**Deliverables**

1. Question: Write the technical question.
2. Code Implementation: Provide the code that solves the question.
3. Video Explanation: Create a video (under 5 minutes) explaining the question, your code changes and the rationale behind your decisions. Assume a non-technical audience. Note: To create the video, you can use tools like [Loom](https://www.loom.com) or your preferred video recording software.

### **3. [2 hours] The Solution Architect!**

Design a high-level architecture for an online learning platform similar to Coursera. Consider core functionalities such as user management, course creation and management, content delivery, video streaming, payment processing, and analytics.

**Focus on:**

- Identifying key components and their interactions;
- Scalability and performance considerations;
- Technology choices (e.g., databases, messaging systems, cloud platforms and services).

**Deliverables**

1. Architecture: Please provide the architecture link, image, or PDF.
2. Video Explanation: Create a video (under 5 minutes) explaining the architecture diagram and rationale behind your decisions. Assume a non-technical audience. Note: To create the video, you can use tools like [Loom](https://www.loom.com) or your preferred video recording software.

## Finished?

Please reply to our email as soon as you are ready. Good Luck! We are looking forward to seeing you soon! If you have any questions, please do not hesitate to reach out to hernani@ingenius.inc
