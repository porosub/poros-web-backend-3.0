import { Router } from "express";
import jwtAuthMiddleware from "../middlewares/jwt-auth.middleware.js";
import {
  createWorkProgram,
  getAllWorkPrograms,
  getWorkProgramById,
  updateWorkProgramById,
  deleteWorkProgramById,
} from "../controllers/work-program.controller.js";

const workProgramRouter = Router();

workProgramRouter.get("/", getAllWorkPrograms);
workProgramRouter.post("/", jwtAuthMiddleware, createWorkProgram);
workProgramRouter.get("/:id", jwtAuthMiddleware, getWorkProgramById);
workProgramRouter.put("/:id", jwtAuthMiddleware, updateWorkProgramById);
workProgramRouter.delete("/:id", jwtAuthMiddleware, deleteWorkProgramById);

export default workProgramRouter;
