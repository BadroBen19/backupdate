const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const signUpSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true, trim: true },
  Email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "please provide a valid Email"],
  },
  Password: {
    type: String,
    required: true,
    minlength: [8, "please enter at least 8 characters for the password"],
  },
  PasswordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.Password;
      },
      message: "Passwords are not the same",
    },
  },
  Title: { type: String, required: true },
  selectedCategory: { type: String, required: true },
  idNumber: { type: Number, required: true },
  nCCP: { type: Number, required: true },
  amount: { type: Number, required: true },
  description: { type: String, trim: true, required: true },
  image: { type: [String], required: true },
});
signUpSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = await bcrypt.hash(this.Password, 12);
  this.PasswordConfirm = undefined;
  next();
});

const signModel = mongoose.model("signModel", signUpSchema);

module.exports = signModel;
