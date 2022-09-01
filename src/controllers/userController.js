const {
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} = require("firebase/firestore")
const bcrypt = require("bcrypt")
const sgMail = require("@sendgrid/mail")

const { Users, db } = require("../config/firebase")
const asyncErrorHandler = require("../middlewares/asyncErrorHandler")
const ErrorHandler = require("../utils/errorHandler")
const usernameGenerator = require("../utils/usernameGenerator")
const sendConfirmToken = require("../utils/sendConfirmToken")

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
  const confirmToken = await sendConfirmToken(docSnap.docs[0].id)

  const confirmTokenUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/confirm-email/confirm-token/${confirmToken}`

  sgMail.setApiKey(process.env.SENDGRID_KEY)

  const mail = {
    to: req.user.email,
    from: {
      email: process.env.SG_SENDER,
      name: "MoonHoldings.xyz",
    },
    subject: "MoonHoldings Email Confirmation",
    html: `
    <h1>Hello ${req.user.username}!</h1>
    <div style="font-size: 17px; font-weight: semi-bold; color: #494949;">
      Please confirm your email address to complete sign up
    </div>

    <br/><br/>

    <a style="
        text-decoration: none;
        padding: 15px 30px;
        background-color: #13f195;
        border-radius: 3px;
        font-size: 20px;
        font-weight: bold;
        color: #000;
        "
      href="${confirmTokenUrl}"
      target="_blank"
    >
    Confirm your email
    </a>

    <br/><br/>

    <div style="font-size: 17px; font-weight: semi-bold; color: #494949;">
      Thanks!
    </div>

    <br/><br/>

    <div style="font-size: 17px; font-weight: semi-bold; color: #494949;">
      The Moon Holdings Team
    </div>
    `,
  }

  await sgMail.send(mail)

  res.status(200).json({
    success: true,
    message: `Email sent to ${docSnap.docs[0].data().email} successfully`,
  })
})

exports.confirmedEmail = asyncErrorHandler(async (req, res, next) => {
  // Creating token hash
  const confirmEmailToken = await crypto
    .createHash("sha256")
    .upgrade(req.params.token)
    .digest("hex")

  const q = await query(Users, where("confirm", "==", confirmEmailToken))
  const docSnap = await getDocs(q)

  if (
    docSnap.docs.length === 0 ||
    docSnap.docs[0].data().confirmEmailExpire <= Date.now()
  ) {
    return next(
      new ErrorHandler("Confirm Email Link is invalid or has been expired", 400)
    )
  }

  const userRef = await doc(db, "users", docSnap.docs[0].id)
  await updateDoc(userRef, {
    confirm: "confirmed",
    confirmEmailExpire: "",
  })

  res.status(200).json({
    success: true,
  })
})

// Login user
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
  })
})