const async_handler = require("express-async-handler")
const Message = require("../models/messageModels")
const User = require("../models/userModels")
const Chat = require("../models/chatModels")

const messageSend = async_handler(
    async (req, res) => {
        try {
            const { content, chatId } = req.body

            if ((!content || content == "") || (!chatId || chatId == "")) {
                res.status(400).send({
                    'error': "Bad request!!"
                })
                return
            } else {
                let newMessage = {
                    sender: req.user._id,
                    content: content,
                    chat: chatId
                }

                let message = await Message.create(newMessage)
                message = await message.populate("sender", "name profilePic")
                message = await message.populate("chat")
                message = await User.populate(message, {
                    path: 'chat.users',
                    select: 'name ,profilePic email'
                })

                await Chat.findByIdAndUpdate(chatId, {
                    latestMessage: message
                })

                res.status(200).send({
                    "message": "Success",
                    "status": "ok",
                    "data": message
                })
            }

        } catch (err) {
            console.log("err: ", err);
        }
    }
)



const fetchSingleChat = async_handler(
    async (req, res) => {
        try {
            if (req.params.chatId !== "" && req.params.chatId) {
                const allMessage = await Message.find({
                    chat: req.params.chatId
                }).populate('sender', 'name profilePic email').populate("chat")

                if (allMessage) {
                    res.status(200).send({
                        "message": "Success",
                        "status": "ok",
                        "data": allMessage
                    })
                } else {
                    res.status(400).send({
                        "error": "wrong chat Id!!"
                    })
                    return
                }

            } else {
                res.status(400).send({
                    "error": "Bad request!!"
                })
                return
            }

        } catch (error) {
            console.log("error: ", error);
        }
    }
)




module.exports = { messageSend, fetchSingleChat }