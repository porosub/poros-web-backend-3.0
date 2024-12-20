import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import Admin from "../models/admin.model.js";
import { getSecret } from '../config/secrets.js';

export const signup = async (req, res) => {
  try {
    const { registrationKey: registrationKey, ...adminData } = req.body;

    if (
      !registrationKey ||
      registrationKey !== getSecret("REGISTRATION_SECRET_KEY", "REGISTRATION_SECRET_KEY_FILE")
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const registerAdminValidationSchema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string().valid("Writer", "Administrator").required(),
    });

    const { error } = registerAdminValidationSchema.validate(adminData);

    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const existingAdmin = await Admin.findOne({
      where: {
        username: adminData.username,
      },
    });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exist" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    await Admin.create({
      username: adminData.username,
      password: hashedPassword,
      role: adminData.role,
    });

    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = (req, res) => {
  try {
    const { username, password } = req.body;
    Admin.findOne({ where: { username } })
      .then((admin) => {
        if (!admin) {
          return res.status(400).json({ message: "Wrong Username or Password" });
        }

        bcrypt.compare(password, admin.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({ message: "Internal server error" });
          }
          if (!isMatch) {
            return res
              .status(400)
              .json({ message: "Wrong Username or Password" });
          }

          const token = jwt.sign({ id: admin.id }, getSecret("AUTH_SECRET_KEY", "AUTH_SECRET_KEY_FILE"), {
            expiresIn: "1h",
          });
          res.json({ token });
        });
      })
      .catch((err) => res.status(500).json({ message: "Internal server error" }));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
