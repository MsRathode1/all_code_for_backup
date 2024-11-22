const express = require("express")
const connectDB = require("../db/db")
const userRoutes = require("../routes/userRoutes")
const app = express()
app.use(express.json())
connectDB()


app.get("", (req, res) => {
  res.send("running")
})

app.use("/api/user", userRoutes)

app.listen(5000, () => {
  console.log("running on 5000");
})