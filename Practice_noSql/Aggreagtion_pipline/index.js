const express = require("express")
const app = express()
const userRouter = require("./Routes/userRoutes")
const connectDb = require("./Db/db")
connectDb()
app.use("/api", userRouter)


app.listen(8000, () => {
    console.log("running....");
})