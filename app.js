import express from "express";
import "dotenv/config";
import indexRouter from "./routes/index.routes.js";

const app = express();

app.use(express.json({ limit: "20mb" }));

app.use("/", indexRouter);


// Start the server
app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.APP_PORT}`);
});
