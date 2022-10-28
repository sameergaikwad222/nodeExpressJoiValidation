const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const {
  validateSingleMember,
  validateCreateMember,
  validateGetAllMembers,
} = require("../utilFunctions/joiValidations");
// Joi Schema

// Get All Members with Paginations  ###################################JOI Validated
router.get("/", validateGetAllMembers, async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const searchFirstName = req.query.searchFirstName || "";
    const searchLastName = req.query.searchLastName || "";

    const users = await Member.find({
      first_name: { $regex: searchFirstName, $options: "i" },
      last_name: { $regex: searchLastName, $options: "i" },
    })
      .skip(page * limit)
      .limit(limit);

    const totalUsers = await Member.countDocuments({
      first_name: { $regex: searchFirstName, $options: "i" },
      last_name: { $regex: searchLastName, $options: "i" },
    });

    const response = {
      error: false,
      totalUsers,
      page: page + 1,
      limit,
      users,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Member by Id  ###################################JOI Validated
router.get("/:id", validateSingleMember, async (req, res) => {
  let memberId = req.params.id;
  res.status(200).json(await Member.findById(memberId).exec());
});

// Delete Member by Member Name ###################################JOI Validated
router.delete("/:id", validateSingleMember, async (req, res) => {
  let memberId = req.params.id;
  const removedPost = await Member.deleteOne({ _id: memberId });
  res.json(removedPost);
});

// Create a Member with Post Method call ###################################JOI Validated
router.post("/", validateCreateMember, async (req, res) => {
  let { first_name, last_name, email, gender, ip_address } = req.body;
  const member = new Member({
    first_name,
    last_name,
    email,
    gender,
    ip_address,
    createdDate: new Date(),
  });
  k;

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
  let user = await Member.findById(memberId).exec();
  if (user) {
    let { first_name, last_name, email, gender, ip_address } = req.body;
    let updateObj = { first_name, last_name, email, gender, ip_address };

    // cleaning objecet data for further updation
    Object.keys(updateObj).forEach((key) => {
      updateObj[key] === undefined && delete updateObj[key];
    });
    // clean data & set update object
    Object.keys(updateObj).forEach((key) => {
      user[key] = updateObj[key];
    });

    //Update the user
    await user
      .save()
      .then(() => {
        res.status(201).json({ updatedMember: user });
      })
      .catch((e) => {
        console.log(e);
        res.status(501).json({ errorMessage: e });
      });
  } else {
    res.status(401).json({ errorMessage: "No user found" });
  }
});

module.exports = router;
