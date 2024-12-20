import fs from "fs";
import path from "path";
import Joi from "joi";
import "dotenv/config";
import { Op } from "sequelize";
import Member from "../models/member.model.js";

export const getAllMembers = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  const categorization = req.query.categorization;

  try {
    const name = req.query.name;
    const whereClause = name ? { name: { [Op.iLike]: `%${name}%` } } : {};

    if (!categorization) {
      const { count, rows: members } = await Member.findAndCountAll({
        where: whereClause,
        order: ["division", "name"],
        offset,
        limit,
      });

      return res.status(200).json({
        data: members,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
        },
      });
    } else {
      const fetchMembers = async (group, position = null) => {
        const where = { group };
        if (position) where.position = position;
        return Member.findAll({ where, order: [["division"]] });
      };

      const fetchNoGroupMembers = async () => {
        return Member.findAndCountAll({
          where: { group: "-", position: "Member" },
          order: [["division"]],
          offset,
          limit,
        });
      };

      let bpiMembers = null;
      let bphMembers = null;
      let noGroupMembers = null;

      if (page === 1) {
        [bpiMembers, bphMembers, noGroupMembers] = await Promise.all([
          fetchMembers("bpi"),
          fetchMembers("bph"),
          fetchNoGroupMembers(),
        ]);
        return res.status(200).json({
          data: {
            bpi: bpiMembers,
            bph: bphMembers,
            members: noGroupMembers.rows,
          },
          pagination: {
            totalPages: Math.ceil(noGroupMembers.count / limit),
            currentPage: page,
          },
        });
      } else {
        noGroupMembers = await fetchNoGroupMembers();
        return res.status(200).json({
          data: {
            members: noGroupMembers.rows,
          },
          pagination: {
            totalPages: Math.ceil(noGroupMembers.count / limit),
            currentPage: page,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error fetching members:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const createMember = async (req, res) => {
  try {
    const { isValid, error: validationError } = validateMember(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const { name, position, division, group, image } = req.body;

    const {
      isSuccessful,
      imageFileName,
      error: imageError,
    } = processImage(req.body);
    if (!isSuccessful) {
      return res.status(400).json({
        error: imageError,
      });
    }

    const newMember = await Member.create({
      name,
      position,
      division,
      group,
      imageFileName,
    });

    return res.status(201).json({
      data: newMember,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({
        error: "Member not found",
      });
    }

    return res.status(200).json({
      data: member,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const updateMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({
        error: "Member not found",
      });
    }

    const { isValid, validationError } = validateMember(req.body);
    if (!isValid) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const { isSuccessful, imageFileName, imageError } = processImage(req.body);
    if (!isSuccessful && error !== "File already exist") {
      return res.status(400).json({
        error: imageError,
      });
    }

    member.name = req.body.name;
    member.position = req.body.position;
    member.division = req.body.division;
    member.group = req.body.group;
    if (!imageError && imageFileName !== null) {
      const { isSuccessful, error } = deleteImage(member.imageFileName);
      if (!isSuccessful) {
        return res.status(500).json({
          error: error,
        });
      }
      member.imageFileName = imageFileName;
    }

    await member.save();
    return res.status(200).json({
      data: member,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({
        error: "Member not found",
      });
    }

    const { isSuccessful, error } = deleteImage(member.imageFileName);
    if (!isSuccessful) {
      return res.status(500).json({
        error: error,
      });
    }

    await member.destroy();
    return res.status(200).json({
      data: member,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

const validateMember = (memberInput) => {
  const memberValidationSchema = Joi.object({
    name: Joi.string().required(),
    position: Joi.string().required(),
    division: Joi.string()
      .valid("Back-end", "Front-end", "Cybersecurity")
      .required(),
    group: Joi.string().valid("bpi", "bph", "-").required(),
    image: Joi.string().pattern(
      /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/
    ),
  });

  const { error } = memberValidationSchema.validate(memberInput, {
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

const processImage = (requestBody) => {
  if (!requestBody.image) {
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

  const mimeTypeMatch = requestBody.image.match(
    /data:image\/([a-zA-Z]+);base64,/
  );
  if (!mimeTypeMatch) {
    return { isSuccessful: false, error: "Invalid image format" };
  }

  const mimeType = mimeTypeMatch[1];
  const extension = mimeExtensionMap[mimeType];

  const base64Data = requestBody.image.split(",")[1];
  const buffer = Buffer.from(base64Data, "base64");

  if (!fs.existsSync(process.env.IMAGE_STORAGE_LOCATION)) {
    fs.mkdirSync(process.env.IMAGE_STORAGE_LOCATION);
  }

  const nameAcronym = requestBody.name
    .trim()
    .split(" ")
    .map((word) => word[0].toLowerCase())
    .join("");

  const divisionMap = {
    "Back-end": "be",
    "Front-end": "fe",
  };

  const divAcronym = divisionMap[requestBody.division] || "sec";
  const fileName = `${divAcronym}-${nameAcronym}.${extension}`;
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
      console.error(err);
      return {
        isSuccessful: false,
        error: "Error deleting image",
      };
    }
  } else {
    return { isSuccessful: false, error: "File not found" };
  }
};
