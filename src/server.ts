import morgan from "morgan";
import { buildApp } from "./app.js";

const app = buildApp();
const PORT = process.env.PORT || 4000;

app.get("/", (_, res) => {
  res.send("Hello, Express with TypeScript!");
});

// Configure morgan logging based on environment.
const environment = process.env.NODE_ENV || "development";
app.use(environment === "development" ? morgan("dev") : morgan("tiny"));

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Listen for the SIGTERM signal to gracefully shut down the server.
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
