const express = require("express")
const { registerUser } = require("../controllers/userController")

const router = express.Router()

router.route("/register").post(registerUser)
// router.route("/register").post(validatePassword, registerUser)

//test
router.get("/get", (req, res, next) => {
  res.json({
    success: true,
  })
})

module.exports = router
