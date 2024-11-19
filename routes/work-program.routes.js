import { Router } from "express";
import jwtAuthMiddleware from "../middlewares/jwt-auth.middleware.js";
import {
  createWorkProgram,
  getAllWorkPrograms,
  getWorkProgramById,
  updateWorkProgramById,
  deleteWorkProgramById,
} from "../controllers/work-program.controller.js";
