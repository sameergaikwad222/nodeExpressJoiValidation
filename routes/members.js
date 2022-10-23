const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Joi = require("joi");
const getPaginationPageSize = require("../utilFunctions/paginations");

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

// Get All Members with Paginations
router.get("/", async (req, res) => {
  let { page, size, sort } = req.query;
  let requestedUsers = [];

  if (!page) page = 1; //Default value is One
  if (!size) size = 10; //Default size is 10
  if (!sort) sort = 1; //Default sort is Ascending

  let requestedSkip = 0;
  const requestedSize = parseInt(size);
  const requestedSort = parseInt(sort);
  const requestedPage = parseInt(page);
  const SET_PAGE_SIZE = getPaginationPageSize(requestedSize);

  if (SET_PAGE_SIZE) {
    requestedSkip = (requestedPage - 1) * SET_PAGE_SIZE;
    requestedUsers = await Member.find()
      .sort({ _id: requestedSort })
      .skip(requestedSkip)
      .limit(SET_PAGE_SIZE);
  } else {
    requestedUsers = await Member.find()
      .sort({ _id: requestedSort })
      .limit(SET_PAGE_SIZE);
  }

  res.status(200).json(requestedUsers);
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
