import Member from "../models/member.model.js";

export const getAllMembers = (req, res) => {};


export const createMember = async (req, res) => {
  const { name, position, division, group } = req.body;

  try {
    let imageURL = null;

    if (req.file) {
      imageURL = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const newMember = await Member.create({
      name,
      position,
      division,
      group,
      imageURL,
    });

    console.log('New member created:', newMember.toJSON());

    res.status(201).json({
      message: "Member created successfully",
      member: newMember,
    });
  } catch (error) {
    console.error('Error creating member:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};


export const getMemberById = (req, res) => {};

export const updateMemberById = (req, res) => {};

export const deleteMemberById = (req, res) => {};
