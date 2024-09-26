import Member from "../models/member.model.js";

export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve members." });
  }
};

export const createMember = async (req, res) => {
  const { name, position, division, imageURL } = req.body;

  try {
    const newMember = await Member.create({
      name,
      position,
      division,
      imageURL,
    });
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findByPk(id);
    if (member) {
      res.status(200).json(member);
    } else {
      res.status(404).json({ error: "Member not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve member." });
  }
};

export const updateMemberById = async (req, res) => {
  const { id } = req.params;
  const { name, position, division, imageURL } = req.body;

  try {
    const member = await Member.findByPk(id);
    if (member) {
      member.name = name || member.name;
      member.position = position || member.position;
      member.division = division || member.division;
      member.imageURL = imageURL || member.imageURL;
      await member.save();
      res.status(200).json(member);
    } else {
      res.status(404).json({ error: "Member not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update member." });
  }
};

export const deleteMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findByPk(id);
    if (member) {
      await member.destroy();
      res.status(200).json({ message: "Member deleted successfully." });
    } else {
      res.status(404).json({ error: "Member not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete member." });
  }
};
