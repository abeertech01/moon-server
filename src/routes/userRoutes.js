const express = require("express")

const router = express.Router()

// router.route("/register").post(validatePassword, registerUser)

//test
router.get("/get", (req, res, next) => {
  res.json({
    success: true,
  })
})

module.exports = router
