const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const generateToken = require("../utils/generateToken");

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const validationResult = logInValidation({ email, password });

  if (validationResult.error) {
    throw Error(validationResult.error.details[0].message);
  }

  const user = await UserModel.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id);
    res.status(201).json(user);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//register

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await UserModel.findOne({ email: email });
  if (userExists) {
    res.status(401);
    throw new Error("User already exists");
  }

  const validationResult = registerValidation({ name, email, password });

  if (validationResult.error) {
    throw Error(validationResult.error.details[0].message);
  }

  const user = await UserModel.create({ name, email, password });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json(user);
  }
});

//logout
const logOutUser = asyncHandler(async (req, res) => {
  res.cookie("jwtoken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ msg: "user logged out" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userProfile = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(userProfile);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await UserModel.findById(req.user._id);

  if (user) {
    const validationResult = profileUpdateValidation({ email, name, password });
    if (validationResult.error) {
      throw Error(validationResult.error.details[0].message);
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(401);
    throw new Error("user not found");
  }
});

const registerValidation = (Inp) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,}$")).required(),
  });
  return schema.validate(Inp);
};

const logInValidation = (Inp) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,}$")).required(),
  });
  return schema.validate(Inp);
};

const profileUpdateValidation = (Inp) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    name: Joi.string(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,}$")),
  });
  return schema.validate(Inp);
};

module.exports = {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
};
