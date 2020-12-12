const Yup = require("yup");

const validateBody = (schema) => async (req, res, next) => {
    try {
        const result = await schema.validate(req.body);
        if (!result) {
            if (!req.value) req.value = {};
            req.value.body = result;
            next();
        }
    } catch (error) {
        next(error);
    }
};

const validateId = (schema, fieldId) => async (req, res, next) => {
    try {
        const result = await schema.validate(req.params[fieldId]);
        if (result) {
            if (!req.value) req.value = {};
            if (!req.value.params) req.value.params = result;
            next();
        }
    } catch (error) {
        next(error);
    }
};

const schemas = {
    idSchema: Yup.string().matches(/^[0-9a-fA-F]{24}$/),
};

module.exports = {
    validateId,
    validateBody,
    schemas,
};
