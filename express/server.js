import express from "express";
import seriesRoutes from "./routes/series.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/series", seriesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
