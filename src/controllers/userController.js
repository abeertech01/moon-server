const asyncErrorHandler = require("../middlewares/asyncErrorHandler")
const ErrorHandler = require("../utils/errorHandler")

// Register a user
exports.registerUser = asyncErrorHandler((req, res, next) => {
  // ----- Check if the email is associated to an existing account -----
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler("Each field needs to be fulfilled", 409))
  }

  res.json({
    msg: "register controller",
  })
})
