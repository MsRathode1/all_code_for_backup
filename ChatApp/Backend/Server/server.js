const express = require('express')
const dotenv = require('dotenv')
const User = require("../models/userModels")
const connectMongo = require('../db/config')
const userRoutes = require('../routes/userRoutes')
const chatRoutes = require("../routes/chatRoutes")
const cors = require('cors')
const messageRoute = require("../routes/messageRoute")
const { errorHandler, notFound } = require("../middlewares/errorMiddleware")

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()
connectMongo()

app.get('/', async (req, res) => {
    const result = await User.find()
    console.log("result: ", result);
    res.send("success")
})

app.use('/api/user', userRoutes)
app.use('/api/chats', chatRoutes)
app.use("/api/userMessage", messageRoute)
// app.use(notFound)
// app.use(errorHandler)



const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`server is running on ${PORT} port!!`);
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData.id)
        socket.emit("connected")
    })

    socket.on("typing", (room) => {
        socket.in(room)
        socket.emit("typing")
    })

    socket.on("stop typing", (room) => {
        socket.in(room)
        socket.emit("stop typing")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("room: ", room);
    })

    socket.on("new message", (newMessage) => {
        const chat = newMessage.chat
        if (!chat.users) return console.log("no users define");

        chat.users.forEach(element => {
            if (element._id === newMessage.sender._id) {
                return
            } else {
                socket.in(element._id).emit("message recieved", newMessage)
            }
        });

    })
})