import { randomUUID } from "crypto";
import WorkProgram from "../models/work-program.model.js";

export const createWorkProgram = async (req, res) => {
  try {
    const { isValid, error: validationError } = validateWorkProgram(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const { name, description, image } = req.body;

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

    const newWorkProgram = await WorkProgram.create({
      name,
      description,
      imageFileName,
    });

    return res.status(201).json({
      data: newWorkProgram,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getAllWorkPrograms = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  try {
    const { count, rows: workPrograms } = await WorkProgram.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      data: workPrograms,
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

export const getWorkProgramById = async (req, res) => {
  try {
    const id = req.params.id;
    const workProgram = await WorkProgram.findByPk(id);
    if (!workProgram) {
      return res.status(404).json({
        error: "Work Program not found",
      });
    }

    return res.status(200).json({
      data: workProgram,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const updateWorkProgramById = async (req, res) => {
  try {
    const id = req.params.id;
    const workProgram = await WorkProgram.findByPk(id);

    if (!workProgram) {
      return res.status(404).json({
        error: "WorkProgram not found",
      });
    }

    const { isValid, validationError } = validateWorkProgram(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const { name, description, image } = req.body;
    workProgram.name = name;
    workProgram.description = description;

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
      const { isSuccessful, error } = deleteImage(workProgram.imageFileName);
      if (!isSuccessful) {
        console.error("Error deleting image:", error);
        return res.status(500).json({
          error: error,
        });
      }
      workProgram.imageFileName = imageFileName;
    }

    await workProgram.save();
    return res.status(201).json({
      data: workProgram,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteWorkProgramById = async (req, res) => {
  try {
    const id = req.params.id;
    const workProgram = await WorkProgram.findByPk(id);

    if (!workProgram) {
      return res.status(400).json({
        error: "Work Program not found",
      });
    }

    const { isSuccessful, error } = deleteImage(workProgram.imageFileName);
    if (!isSuccessful) {
      return res.status(500).json({
        error: error,
      });
    }

    await workProgram.destroy();
    return res.status(200).json({
      data: workProgram,
    });
  } catch (error) {
    console.err(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

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

  if (!fs.existsSync(process.env.IMAGE_STORAGE_LOCATION)) {
    fs.mkdirSync(process.env.IMAGE_STORAGE_LOCATION);
  }

  const fileName = `wp-${randomUUID()}.${extension}`;
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
