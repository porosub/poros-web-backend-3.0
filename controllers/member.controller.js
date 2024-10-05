import fs from "fs";
import path from "path";
import "dotenv/config";
import { Op } from "@sequelize/core";
import Member from "../models/member.model.js";

export const getAllMembers = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  const categorization = req.query.categorization;

  try {
    if (!categorization || page !== 1) {
      const { count, rows: members } = await Member.findAndCountAll({
        order: ["name"],
        offset,
        limit,
      });

      return res.status(200).json({
        members: members,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    }

    const [bpiMembers, bphMembers, noGroupMembers] = await Promise.all([
      Member.findAll({ where: { group: "bpi" } }),
      Member.findAll({ where: { group: "bph" } }),
      Member.findAndCountAll({
        where: { group: { [Op.is]: null } },
        order: [["division"], ["name"]],
        offset,
        limit,
      }),
    ]);

    return res.status(200).json({
      bpi: bpiMembers,
      bph: bphMembers,
      members: noGroupMembers.rows,
      totalItems: noGroupMembers.count,
      totalPages: Math.ceil(noGroupMembers.count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const createMember = (req, res) => {};

export const getMemberById = async (req, res) => {
  try {
    const result = await Member.findOne({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
  }
};

export const updateMemberById = (req, res) => {};

export const deleteMemberById = (req, res) => {};

const processImage = (requestBody) => {
  if (!requestBody.image.startsWith("data:image/")) {
    return { isSuccessful: false, error: "Invalid image format" };
  }

  const mimeExtensionMap = {
    png: "png",
    jpeg: "jpg",
    gif: "gif",
    bmp: "bmp",
    webp: "webp",
  };

  const mimeType = requestBody.image.match(
    /data:image\/([a-zA-Z]+);base64,/
  )[1];

  const extension = mimeExtensionMap[mimeType];

  const buffer = Buffer.from(requestBody.image, "base64");

  if (!fs.existsSync(process.env.IMAGE_STORAGE_LOCATION)) {
    fs.mkdirSync(process.env.IMAGE_STORAGE_LOCATION);
  }

  const nameAcronym = requestBody.name
    .split(" ")
    .map((word) => word[0].toLowerCase())
    .join("");

  let divAcronym;
  const divisionMap = {
    "Back end": "be",
    "Front end": "fe",
  };

  divAcronym = divisionMap[requestBody.division] || "sec";

  const filePath = path.join(
    process.env.IMAGE_STORAGE_LOCATION,
    `${nameAcronym}-${divAcronym}.${extension}`
  );

  fs.writeFileSync(filePath, buffer, (err) => {
    if (err) {
      return { isSuccessful: false, error: "Error saving image", detail: err };
    }
    return { isSuccessful: true, imageURL: filePath };
  });
};
