const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwtoken;
  console.log(token);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await UserModel.findById(decoded.userId).select("-password");
      next();
    } catch (err) {
      res.status(401);
      throw new Error("not authorized, invalid token");
    }
  } else {
    throw new Error("not authorized, no token");
  }
});

module.exports = { protect };
