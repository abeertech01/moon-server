const express = require("express")
const passport = require("passport")
const {
  registerUser,
  confirmEmail,
  confirmedEmail,
  loginUser,
  updatePassword,
} = require("../controllers/userController")
const checkAuth = require("../middlewares/checkAuth")
const validatePassword = require("../middlewares/validatePassword")

const router = express.Router()

// router.route("/register").post(registerUser)
router.route("/register").post(validatePassword, registerUser)

router.route("/confirm-email").post(checkAuth, confirmEmail)

router.route("/confirm-email/confirm-token/:token").put(confirmedEmail)

router.route("/login").post(passport.authenticate("local"), loginUser)

router.route("/password/update").put(checkAuth, updatePassword)

module.exports = router
