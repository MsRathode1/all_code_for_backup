const express = require('express')
const app = express()
const connection = require("./config/connection")
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")

connection()
app.use(express.json())

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

app.get("/", async (req, res) => {
    res.send("test")
})



app.use("/api", userRoutes)
app.use("/api/product", productRoutes)

app.listen(8000, () => {
    console.log("running on 8000");
})