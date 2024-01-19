const express = require("express");

const router = express.Router();
const {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logOutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
