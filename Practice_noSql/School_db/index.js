const express = require("express")
const app = express()
const userRoute = require("./Routes/userRoutes")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1", userRoute)




app.listen(8000, () => {
    console.log("server is running");
})