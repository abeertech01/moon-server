const asyncErrorHandler = require("../middlewares/asyncErrorHandler")

// Register a user
exports.registerUser = asyncErrorHandler((req, res, next) => {
  // ----- Check if the email is associated to an existing account -----
  const { email, password } = req.body

  res.json({
    msg: "register controller",
  })
})
