//VALIDATION
const Joi = require("@hapi/joi");

//Add User Valitation
const addUserValidation = (data) => {
    const schema = Joi.object({
        txtUsername: Joi.string().min(6).required(),
        txtEmail: Joi.string().min(6).required().email(),
        txtPassword: Joi.string().min(6).required(),
        // Image: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        // name: Joi.string().min(6).required(),
        txtUsername: Joi.string().min(2).required(),
        txtPassword: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};



module.exports.addUserValidation = addUserValidation;
module.exports.loginValidation = loginValidation;

