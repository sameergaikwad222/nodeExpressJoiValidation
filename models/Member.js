const mongoose = require("mongoose");

const MemberSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  ip_address: {
    type: String,
    required: true,
  },
  createdDate: Date,
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Members", MemberSchema);
