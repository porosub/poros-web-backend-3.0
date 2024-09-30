import Member from "../models/member.model.js";

export const getAllMembers = (req, res) => {};

export const createMember = (req, res) => {};

export const getMemberById = async (req, res) => {

    try {
        const result = await Member.findOne({
            where:{
                id: req.params.id
            }
        })

        return res
            .status(200)
            .json(result);

    } catch (error) {
        console.error(error);
    }

};

export const updateMemberById = (req, res) => {};

export const deleteMemberById = (req, res) => {};
