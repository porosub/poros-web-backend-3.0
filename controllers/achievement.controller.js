import fs from "fs";
import path from "path";
import Joi from "joi";
import { randomUUID } from "crypto";
import Achievement from "../models/achievement.model.js";

export const createAchievement = async (req, res) => {
  try {
    const { isValid, error: validationError } = validateAchievement(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const { title, competitionName, teamName, image } = req.body;

    const {
      isSuccessful,
      imageFileName,
      error: imageError,
    } = processImage(image);
    if (!isSuccessful) {
      return res.status(400).json({
        error: imageError,
      });
    }

    console.log("test");

    const newAchievement = await Achievement.create({
      title,
      competitionName,
      teamName,
      imageFileName,
    });

    return res.status(201).json({
      data: newAchievement,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getAllAchievements = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  try {
    const { count, rows: achievements } = await Achievement.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      data: achievements,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getAchievementById = async (req, res) => {
  try {
    const id = req.params.id;
    const achievement = await Achievement.findByPk(id);
    if (!achievement) {
      return res.status(404).json({
        error: "Achievement not found",
      });
    }

    return res.status(200).json({
      data: achievement,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const updateAchievementById = async (req, res) => {
  try {
    const id = req.params.id;
    const achievement = await Achievement.findByPk(id);

    if (!achievement) {
      return res.status(404).json({
        error: "Achievement not found",
      });
    }

    const { isValid, validationError } = validateAchievement(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const { title, competitionName, teamName, image } = req.body;
    achievement.title = title;
    achievement.competitionName = competitionName;
    achievement.teamName = teamName;

    const {
      isSuccessful,
      imageFileName,
      error: imageError,
    } = processImage(image);
    if (!isSuccessful && imageError !== "File already exist") {
      return res.status(400).json({
        error: imageError,
      });
    }

    if (!imageError && imageFileName !== null) {
      const { isSuccessful, error } = deleteImage(achievement.imageFileName);
      if (!isSuccessful) {
        console.error("Error deleting image:", error);
        return res.status(500).json({
          error: error,
        });
      }
      achievement.imageFileName = imageFileName;
    }

    await achievement.save();
    console.log("Achievement updated successfully:", achievement);
    return res.status(201).json({
      data: achievement,
    });
  } catch (error) {
    console.error("Error updating achievement:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteAchievementById = async (req, res) => {
  try {
    const id = req.params.id;
    const achievement = await Achievement.findByPk(id);

    if (!achievement) {
      return res.status(400).json({
        error: "Achievement not found",
      });
    }

    const { isSuccessful, error } = deleteImage(achievement.imageFileName);
    if (!isSuccessful) {
      return res.status(500).json({
        error: error,
      });
    }

    await achievement.destroy();
    return res.status(200).json({
      data: achievement,
    });
  } catch (error) {
    console.err(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

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
    console.error(err);
    return { isSuccessful: false, error: "Error saving image" };
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
      };
    }
  } else {
    return { isSuccessful: false, error: "File not found" };
  }
};
