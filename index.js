require("dotenv").config({ path: "./src/config/config.env" })

const express = require("express")
const passport = require("passport")
const session = require("express-session")
const cors = require("cors")

// routes and middlewares

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
app.listen(6069)
