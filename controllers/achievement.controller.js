import { randomUUID } from "crypto";
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

const processImage = (imageString) => {
  if (!imageString) {
    return {
      isSuccessful: true,
      imageFileName: null,
    };
  }

  const mimeExtensionMap = {
    png: "png",
    jpeg: "jpg",
    gif: "gif",
    bmp: "bmp",
    webp: "webp",
  };

  const mimeTypeMatch = imageString.match(/data:image\/([a-zA-Z]+);base64,/);
  if (!mimeTypeMatch) {
    return { isSuccessful: false, error: "Invalid image format" };
  }

  const mimeType = mimeTypeMatch[1];
  const extension = mimeExtensionMap[mimeType];

  const base64Data = imageString.split(",")[1];
  const buffer = Buffer.from(base64Data, "base64");

  if (!fs.existsSync(process.env.IMAGE_STORAGE_LOCATION)) {
    fs.mkdirSync(process.env.IMAGE_STORAGE_LOCATION);
  }

  const fileName = `a-${randomUUID()}.${extension}`;
  const filePath = path.join(process.env.IMAGE_STORAGE_LOCATION, fileName);

  try {
    fs.writeFileSync(filePath, buffer);

    return {
      isSuccessful: true,
      imageFileName: fileName,
    };
  } catch (err) {
    return { isSuccessful: false, error: "Error saving image", detail: err };
  }
};

const deleteImage = (fileName) => {
  const filePath = path.join(process.env.IMAGE_STORAGE_LOCATION, fileName);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return { isSuccessful: true };
    } catch (err) {
      return {
        isSuccessful: false,
        error: "Error deleting image",
        detail: err,
      };
    }
  } else {
    return { isSuccessful: false, error: "File not found" };
  }
};
