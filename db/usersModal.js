const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
  },
});

usersSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

usersSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};
const User = mongoose.model("User", usersSchema);
module.exports = {
  User,
};
