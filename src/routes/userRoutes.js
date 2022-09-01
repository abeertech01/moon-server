const express = require("express")
const { registerUser } = require("../controllers/userController")
const validatePassword = require("../middlewares/validatePassword")

const router = express.Router()

// router.route("/register").post(registerUser)
router.route("/register").post(validatePassword, registerUser)

module.exports = router
