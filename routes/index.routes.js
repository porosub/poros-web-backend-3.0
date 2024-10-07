import { Router } from "express";
import blogPostRouter from "./blogpost.routes.js";
import memberRouter from "./member.routes.js";
import authRouter from "./auth.routes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/blogposts", blogPostRouter);
indexRouter.use("/members", memberRouter);
indexRouter.use("/images", express.static(process.env.IMAGE_STORAGE_LOCATION));

export default indexRouter;
