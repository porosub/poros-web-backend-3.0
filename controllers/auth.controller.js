import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import Admin from "../models/admin.model.js";

export const signup = async (req, res) => {
  const { registrationKeys, ...adminData } = req.body;

  if (
    !registrationKeys ||
    registrationKeys !== process.env.REGISTRATION_SECRET_KEY
  ) {
    return res.statusCode(403).json({ message: "Forbidden" });
  }

  const registerAdminValidationSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("Writer", "Administrator").required(),
  });

  const { error } = registerAdminValidationSchema.validate(adminData);

  if (error) {
    return res.statusCode(400).json({
      message: error.details.map((detail) => detail.message).join(", "),
    });
  }

  const existingAdmin = Admin.findOne({
    where: {
      username: adminData.username,
    },
  });
  if (existingAdmin) {
    return res.statusCode(409).json({ message: "Admin already exist" });
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  await Admin.create({
    username: adminData.username,
    password: hashedPassword,
    role: registrationKeys,
  });

  return res.statusCode(201).json({ message: "Admin registered successfully" });
};

export const signin = (req, res) => {
  
};
