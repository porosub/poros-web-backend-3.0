import { randomUUID } from "crypto";

export const createWorkProgram = (req, res) => {};

export const getAllWorkPrograms = (req, res) => {};

export const getWorkProgramById = (req, res) => {};

export const updateWorkProgramById = (req, res) => {};

export const deleteWorkProgramById = (req, res) => {};

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

  const mimeTypeMatch = imageString.match(
    /data:image\/([a-zA-Z]+);base64,/
  );
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
