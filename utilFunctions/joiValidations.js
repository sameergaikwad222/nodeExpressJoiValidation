const Joi = require("joi");

const createMemberSchema = Joi.object({
  _id: Joi.string().pattern(new RegExp("/[a-z A-Z 0-9]/")),
  first_name: Joi.string().alphanum().required(),
  last_name: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  gender: Joi.string().valid("Male", "Female").required(),
  ip_address: Joi.string().required(),
}).unknown(false);

const getAllMemberSchema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(5).optional(),
  searchFirstName: Joi.string().alphanum().optional(),
  searchLastName: Joi.string().alphanum().optional(),
}).unknown(false);

const getOneMemberSchema = Joi.object({
  id: Joi.string().alphanum().case("lower").min(24).max(24).required(),
}).unknown(false);

// Middleware Validation

const validateSingleMember = function (req, res, next) {
  const { error } = getOneMemberSchema.validate(req.params, {
    abortEarly: false,
  });
  if (error) {
    res.status(500).json({ errorDetails: error.details });
  } else {
    next();
  }
};

const validateGetAllMembers = function (req, res, next) {
  const { error } = getAllMemberSchema.validate(req.query, {
    abortEarly: false,
  });
  if (error) {
    res.status(401).json({ errorDetails: error.details });
  } else {
    next();
  }
};

const validateCreateMember = function (req, res, next) {
  const { error } = createMemberSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    res.status(401).json({ errorDetails: error.details });
  } else {
    next();
  }
};

module.exports = {
  validateSingleMember,
  validateCreateMember,
  validateGetAllMembers,
};
