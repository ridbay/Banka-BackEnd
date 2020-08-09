const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    type: String,
    isAdmin: Boolean,
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accounts",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator, { message: "Email already in use." });

module.exports = mongoose.model("User", userSchema, "users");
