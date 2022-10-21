const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Joi = require("joi");

// Joi Schema

const memberSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  gender: Joi.string().valid("Male", "Female").required(),
  ip_address: Joi.string().required(),
}).unknown(false);

// Middleware Validation

const validateMember = function (req, res, next) {
  const { error } = memberSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(401).json({ errorDetails: error.details });
  } else {
    next();
  }
};

// Get All Members
router.get("/", async (req, res) => {
  res.json(await Member.find());
});

// Get Member by Id
router.get("/:id", async (req, res) => {
  let memberId = req.params.id;
  res.status(200).json(await Member.findById(memberId).exec());
});

// Delete Member by Member Name
router.delete("/:id", async (req, res) => {
  let memberId = req.params.id;
  const removedPost = await Member.deleteOne({ _id: memberId });
  res.json(removedPost);
});

// Create a Member with Post Method call
router.post("/", validateMember, async (req, res) => {
  let { first_name, last_name, email, gender, ip_address } = req.body;
  const member = new Member({
    first_name,
    last_name,
    email,
    gender,
    ip_address,
    createdDate: new Date(),
  });

  try {
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err_msg: error });
  }
});

// Update a member
router.patch("/:id", async (req, res) => {
  let memberId = req.params.id;
  const updatePost = await Member.updateOne(
    { _id: memberId },
    {
      $set: {
        first_name: req.body.first_name,
      },
    }
  );
  res.json(updatePost);
});

module.exports = router;
