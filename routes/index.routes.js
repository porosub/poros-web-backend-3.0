import { Router } from "express";
import { blogRouter } from "./blog.routes.js";
import { memberRouter } from "./member.routes.js";
import { authRouter } from "./auth.routes.js";

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/blogs", blogRouter);
indexRouter.use("/members", memberRouter);

export default indexRouter;
