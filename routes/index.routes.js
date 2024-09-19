import { Router } from "express";
import { blogRouter } from "./blog.routes.js";
import { memberRouter } from "./member.routes.js";
import { authRouter } from "./auth.routes.js";

const indexRouter = Router();

indexRouter.use("/blogs", blogRouter);
indexRouter.use("/members", memberRouter);
indexRouter.use("/auth", authRouter);

export default indexRouter;
