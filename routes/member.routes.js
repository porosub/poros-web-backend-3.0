import { Router } from "express";
import jwtAuthMiddleware from "../middlewares/jwt-auth.middleware.js";
import {
  getAllMembers,
  createMember,
  getMemberById,
  updateMemberById,
  deleteMemberById,
} from "../controllers/member.controller.js";

const memberRouter = Router();

memberRouter.get("/", getAllMembers);
memberRouter.post("/", jwtAuthMiddleware, createMember);
memberRouter.get("/:id", jwtAuthMiddleware, getMemberById);
memberRouter.put("/:id", jwtAuthMiddleware, updateMemberById);
memberRouter.delete("/:id", jwtAuthMiddleware, deleteMemberById);

export default memberRouter;
