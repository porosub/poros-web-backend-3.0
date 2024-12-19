import express from "express";
import cacheImage from "../middlewares/cache-image.middleware.js";
import blogPostRouter from "./blogpost.routes.js";
import memberRouter from "./member.routes.js";
import authRouter from "./auth.routes.js";
import achievementRouter from "./achievement.routes.js";
import workProgramRouter from "./work-program.routes.js";

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);
// indexRouter.use("/blogposts", blogPostRouter);
indexRouter.use("/members", memberRouter);
indexRouter.use("/achievements", achievementRouter);
indexRouter.use("/work-programs", workProgramRouter);
indexRouter.use(
  "/images",
  cacheImage,
  express.static(process.env.IMAGE_STORAGE_LOCATION)
);

export default indexRouter;
