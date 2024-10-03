import { body, validationResult } from "express-validator";

export const validateMemberCreation = [
    body("name").exists().withMessage("Name is required").isString().withMessage("Name must be a string"),
    body("position").exists().withMessage("Position is required").isString().withMessage("Position must be a string"),
    body("division").exists().withMessage("Division is required").isString().withMessage("Division must be a string"),
    body("group").exists().withMessage("Group is required").isString().withMessage("Group must be a string"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
]