# Technical question

In order to evaluate candidate expertise, consider following sample task and propose a code solution that satisfy requirements:

Machine monitoring system.
You have to develop a web service which serve periodically sampled machine hardware resource usage data such as CPU and RAM usage.
Immagine that data served should be suitable for building a usage graph by clients
The API has to include at least two endpoints:

- `/api/samples/last/`: Get the last usage sample
- `/api/samples/?limit={x}&offset={y}`: Get the paginated list of samples sorted in descending order by the sample creation timestamp.

The candidate must implement a web service as described, with particular emphasis on the usage data collection system, prioritising code quality, error handling, and efficiency.
The candidate must also design a pool of tests in order to show correct API functionality, and error handling.
