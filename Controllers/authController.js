const signModel = require("../models");
const jwt = require("jsonwebtoken");
const catchAsync = require("../catchAsync");
const bcrypt = require("bcrypt");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.getSignup = async (req, res) => {
  return res.redirect("pager.html");
};

exports.getLogin = async (req, res) => {
  return res.redirect("login.html");
};

exports.signUp = catchAsync(async (req, res, next) => {
  const dataUser = await signModel.create({
    user: req.body.user,
    Email: req.body.Email,
    Password: req.body.Password,
    PasswordConfirm: req.body.PasswordConfirm,
    Title: req.body.Title,
    selectedCategory: req.body.selectedCategory,
    idNumber: req.body.idNumber,
    nCCP: req.body.nCCP,
    amount: req.body.amount,
    description: req.body.description,
    image: req.body.image,
  });
  const token = signToken(dataUser._id);
  await dataUser.save();
  res.status(201).json({
    status: "success",
    token,
    data: {
      newUser: dataUser,
    },
  });
  res.redirect("login.html");
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const user = await signModel.findOne({ Email: req.body.email });
    if (user) {
      // Comparaison des mots de passe cryptés
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.Password
      );
      if (passwordMatch) {
        // Mot de passe correct
        const token = signToken(datauser._id);
        res.status(200).json({
          status: "success",
          token,
        });
      } else {
        return next(new appError("INCORRECT PASSWORD !!", 401));
      }
    } else {
      return next(new appError("USER NOT FOUND !!", 401));
    }
  } catch (err) {
    return next(new appError("ERROR", 400));
  }
});
