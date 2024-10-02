import Member from "../models/member.model.js";

export const getAllMembers = (req, res) => {};

export const createMember = (req, res) => {};

export const getMemberByName = async (req, res) => {
    try {
        const {name} = req.params;
        const result = await Member.findOne({
            where : {
                name : name,
            }
        })

        if (!result) {
            return res.status(404).json({message: 'Member not found'});
        }

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
    }
}

export const getMemberById = async (req, res) => {
    try {
        const result = await Member.findByPk(req.params.id)
        return res
            .status(200)
            .json(result);

    } catch (error) {
        console.error(error);
    }
};

export const updateMemberById = (req, res) => {};

export const deleteMemberById = (req, res) => {};
