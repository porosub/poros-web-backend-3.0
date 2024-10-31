import Achievement from "../models/achievement.model.js";

export const createAchievement = (req, res) => {};

export const getAllAchievements = (req, res) => {};

export const getAchievementById = (req, res) => {};

export const updateAchievementById = (req, res) => {};

export const deleteAchievementById = (req, res) => {};

const validateAchievement = (achievementInput) => {
  const achievementValidationSchema = Joi.object({
    title: Joi.string().required(),
    competitionName: Joi.string().required(),
    teamName: Joi.string().required(),
    image: Joi.string().pattern(
      /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/
    ),
  });

  const { error } = achievementValidationSchema.validate(achievementInput, {
    abortEarly: false,
  });

  if (error) {
    return {
      isValid: false,
      error: error.details.map((detail) => detail.message).join(", "),
    };
  } else {
    return { isValid: true, error: null };
  }
};
