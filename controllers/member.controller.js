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
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.status(200).json(member);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
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
    .split(" ")
    .map((word) => word[0].toLowerCase())
    .join("");

  const divisionMap = {
    "Back-end": "be",
    "Front-end": "fe",
  };

  const divAcronym = divisionMap[requestBody.division] || "sec";

  const filePath = path.join(
    process.env.IMAGE_STORAGE_LOCATION,
    `${nameAcronym}-${divAcronym}.${extension}`
  );

  try {
    if (fs.existsSync(filePath)) {
      const existingBuffer = fs.readFileSync(filePath);

      if (buffer.equals(existingBuffer)) {
        return { isSuccessful: false, error: "Same file, skipped" };
      }
    }
    fs.writeFileSync(filePath, buffer);

    return { isSuccessful: true, imageURL: filePath };
  } catch (err) {
    return { isSuccessful: false, error: "Error saving image", detail: err };
  }
};
