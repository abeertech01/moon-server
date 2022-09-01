require("dotenv").config({ path: "./src/config/config.env" })

const express = require("express")
const passport = require("passport")
const session = require("express-session")
const cors = require("cors")

// routes and middlewares
const errorMiddleware = require("./src/middlewares/error")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

const ingredients = [
  {
    id: "1",
    item: "Bacon",
  },
  {
    id: "2",
    item: "Eggs",
  },
  {
    id: "3",
    item: "Milk",
  },
  {
    id: "4",
    item: "Butter",
  },
]

app.get("/ingredients", (req, res) => {
  res.json({
    success: true,
    ingredients,
  })
})

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
