const asyncErrorHandler = require("../middlewares/asyncErrorHandler")

// Register a user
exports.registerUser = asyncErrorHandler((req, res, next) => {
  res.json({
    msg: "register controller",
  })
})
