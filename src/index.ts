import { buildApp } from "./app.js";

const app = buildApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
