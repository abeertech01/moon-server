const { query, where, getDocs, addDoc } = require("firebase/firestore")
const bcrypt = require("bcrypt")
const { Users } = require("../config/firebase")
const asyncErrorHandler = require("../middlewares/asyncErrorHandler")
const ErrorHandler = require("../utils/errorHandler")
const usernameGenerator = require("../utils/usernameGenerator")

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
  if (qSnapshot.docs.length !== 0) {
    return next(
      new ErrorHandler("An account is associated with this email", 409)
    )
  } else {
    const username = await usernameGenerator(email)
    // ------- save user info for registering -------
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    // Add a user document
    const docRef = await addDoc(Users, {
      strategy: "local",
      username,
      email,
      password: hashedPassword,
      confirm: "",
      confirmEmailExpire: null,
      createdAt: serverTimestamp(),
    })

    res.status(200).json({
      success: true,
      userId: docRef.id,
    })
  }
})

// Confirm Email after signup
exports.confirmEmail = asyncErrorHandler(async (req, res, next) => {
  const q = query(Users, where("email", "==", req.user.email))
  const docSnap = await getDocs(q)

  if (docSnap.docs.length === 0) {
    return next(new ErrorHandler("User not found", 404))
  }

  // Get Confirm Email Token

  res.status(200).json({
    success: true,
    message: `Email sent to ${docSnap.docs[0].data().email} successfully`,
  })
})
