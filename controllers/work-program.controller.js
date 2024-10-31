import { randomUUID } from "crypto";
import WorkProgram from "../models/work-program.model.js";

export const createWorkProgram = (req, res) => {};

export const getAllWorkPrograms = (req, res) => {};

export const getWorkProgramById = (req, res) => {};

export const updateWorkProgramById = (req, res) => {};

export const deleteWorkProgramById = (req, res) => {};

const validateWorkProgram = (workProgramInput) => {
  const workProgramValidationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(
      /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/
    ),
  });

  const { error } = workProgramValidationSchema.validate(workProgramInput, {
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

  const workProgramImageLocation =
    process.env.IMAGE_STORAGE_LOCATION + "/work-programs";

  if (!fs.existsSync(workProgramImageLocation)) {
    fs.mkdirSync(workProgramImageLocation);
  }

  const fileName = `wp-${randomUUID()}.${extension}`;
  const filePath = path.join(workProgramImageLocation, fileName);

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
  const workProgramImageLocation =
    process.env.IMAGE_STORAGE_LOCATION + "/work-programs";
  const filePath = path.join(workProgramImageLocation, fileName);
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
