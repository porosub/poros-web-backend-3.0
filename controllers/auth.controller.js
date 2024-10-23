import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { getSecret } from "../config/secrets.js";

export const signup = async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ username, password: hashedPassword });
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error registering admin", error });
  }
};

export const signin = async (req, res) => {
  try {
    console.log("Signin request received:", req.body);
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: admin.id },
      getSecret("AUTH_SECRET_KEY", "AUTH_SECRET_KEY_FILE"),
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Error signing in", error });
  }
};
