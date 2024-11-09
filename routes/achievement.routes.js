import {
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievementById,
  deleteAchievementById,
} from "../controllers/achievement.controller.js";

const achievementRouter = Router();

achievementRouter.get("/", getAllAchievements);
achievementRouter.post("/", jwtAuthMiddleware, createAchievement);
achievementRouter.get("/:id", jwtAuthMiddleware, getAchievementById);
achievementRouter.put("/:id", jwtAuthMiddleware, updateAchievementById);
achievementRouter.delete("/:id", jwtAuthMiddleware, deleteAchievementById);

export default achievementRouter;