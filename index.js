require("dotenv").config({ path: "./src/config/config.env" })

const express = require("express")
const passport = require("passport")
const session = require("express-session")
const cors = require("cors")

// routes and middlewares
const userRoutes = require("./src/routes/userRoutes")
const errorMiddleware = require("./src/middlewares/error")
const passportLocal = require("./src/config/strategies/passportLocal")
// const passportDiscord = require("./src/config/strategies/passportDiscord")
// const passportTwitter = require("./src/config/strategies/passportTwitter")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

passportLocal(passport)
// passportDiscord(passport)
// passportTwitter(passport)

app.get("/ingredients", (req, res) => {
  res.json({
    success: true,
    message: "this message is from testing moonserver",
  })
})

app.use("/api", userRoutes)

app.get("/hello", (req, res) => {
  res.setHeader("Content-Type", "text/html")
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate")
  res.end(
    `Hello this is <strong>MoonServer</strong>! 
    <br/> Please visit the frontend here: 
    <h1><a href="https://moonholdings.xyz">MoonHoldings.xyz</a></h1>`
  )
})

// Middleware for error handling
app.use(errorMiddleware)

app.listen(6069)
