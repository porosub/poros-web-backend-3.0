import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", signup);
authRouter.post("/login", signin);

export default authRouter;
