import express from "express";
import morgan from "morgan";
import seriesRoutes from "./routes/series.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import { ConnDB } from "./infra/database.js";

const app = express();
const PORT = 3000;

app.use(morgan("dev"));

app.use(express.json());

ConnDB();

app.use("/series", seriesRoutes);
app.use("/progress", progressRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
