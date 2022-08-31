const express = require("express")
const app = express()

const cors = require("cors")
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
