const { query, where, getDocs } = require("firebase/firestore")
const { Users } = require("../config/firebase")
const asyncErrorHandler = require("../middlewares/asyncErrorHandler")
const ErrorHandler = require("../utils/errorHandler")

// Register a user
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  // ----- Check if the email is associated to an existing account -----
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorHandler("Each field needs to be fulfilled", 409))
  }

  const q = query(
    Users,
    where("strategy", "==", "local"),
    where("email", "==", email)
  )

  const qSnapshot = await getDocs(q)
  // if (qSnapshot.docs.length !== 0) {
  //   return next(
  //     new ErrorHandler("An account is associated with this email", 409)
  //   )
  // }

  res.json({
    msg: "register controller",
  })
})
