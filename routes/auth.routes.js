import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", signin);
authRouter.post("/login", signup);

export default authRouter;
