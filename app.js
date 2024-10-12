import express from "express";
import cors from 'cors';
import "dotenv/config";
import indexRouter from "./routes/index.routes.js";

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(cors({
  origin: process.env.CLIENT_ADDRESS
}))
app.use("/", indexRouter);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on ${process.env.BASE_URL}:${process.env.APP_PORT}`);
});
