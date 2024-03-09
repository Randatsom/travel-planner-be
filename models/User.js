const mongoose = require("mongoose") ;

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema)
