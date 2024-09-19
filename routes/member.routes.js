import { Router } from "express";
import {
  getAllMembers,
  createMember,
  getMemberById,
  updateMemberById,
  deleteMemberById,
} from "../controllers/member.controller.js";

const memberRouter = Router();

memberRouter.get("/", getAllMembers);
memberRouter.post("/", createMember);
memberRouter.get("/:id", getMemberById);
memberRouter.put("/:id", updateMemberById);
memberRouter.delete("/:id", deleteMemberById);

export default memberRouter;
