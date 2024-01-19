const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });

  res.cookie("jwtoken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "Development",
    SameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

module.exports = generateToken;
