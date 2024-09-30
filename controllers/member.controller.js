import fs from "fs";
import path from "path";
import "dotenv/config";
import Member from "../models/member.model.js";

export const getAllMembers = (req, res) => {};

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
