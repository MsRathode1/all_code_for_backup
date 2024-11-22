const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModels')
const User = require('../models/userModels')


const accessChat = asyncHandler(
    async (req, res, next, err) => {
        if (!err) {
            try {
                const { userId } = req.body

                if (!userId) {
                    res.status(400).send({
                        "error": "User Id not Found!!"
                    })
                    return
                }

                let isChat = await Chat.find({
                    isGroupChat: false,
                    $and: [
                        { users: { $elemMatch: { $eq: req.user._id } } },
                        { users: { $elemMatch: { $eq: userId } } }
                    ]
                }).populate("users", "-password").populate('latestMessage')

                isChat = await User.populate(isChat, {
                    path: "latestMessage.sender",
                    select: "name profilePic email"
                })

                if (isChat.length != 0) {
                    res.status(200).send({ "data": isChat[0] })
                    return
                } else {
                    const chatData = {
                        chatName: "Checking",
                        users: [req.user._id, userId],
                        isGroupChat: false,
                    }

                    try {
                        const createdChat = await Chat.create(chatData)
                        const fullChat = await Chat.findOne({
                            _id: createdChat._id
                        }).populate("users", "-password")

                        res.status(200).send({
                            "data": fullChat
                        })
                    } catch (error) {
                        console.log("error: ", error);

                    }
                }
            } catch (error) {
                console.log("error: ", error);
            }
        } else {
            console.log("accessChat_error", err);
        }
    }
)

const fetchAllChats = asyncHandler(async (req, res, next, err) => {
    if (!err) {
        let allChats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage")


        allChats = await User.populate(allChats, {
            path: "latestMessage.sender",
            select: "name profilePic email"
        })

        res.send({
            "message": "success",
            "data": allChats
        })

    } else {
        console.log("fetchAllChats", err);
    }
})

const createGroupChats = asyncHandler(async (req, res, next, err) => {
    if (!err) {
        if (!req.body.users || !req.body.name) {
            res.status(400).send({
                "error": "Bad request!!"
            })
            return
        } else {
            const groupUsers = JSON.parse(req.body.users)
            if (groupUsers.length > 2) {
                groupUsers.push(req.user)
                try {
                    const groupChat = await Chat.create({
                        chatName: req.body.name,
                        users: groupUsers,
                        isGroupChat: true,
                        groupAdmin: req.user
                    })

                    let fullGroupChat = await Chat.findOne({
                        _id: groupChat._id
                    }).populate("users", "-password").populate("groupAdmin", "-password")

                    res.status(200).send(fullGroupChat)
                } catch (error) {
                    console.log("error: ", error);
                }
            } else {
                res.status(400).send({
                    "error": "More than two users required to create group chat !!"
                })
                return
            }
        }
    } else {
        console.log("createGroupChats", err);
    }
})

const renameGroupChats = asyncHandler(async (req, res, next, err) => {
    if (!err) {
        const { userId, chatName } = req.body

        if (!userId || !chatName) {
            res.status(400).send({
                "error": "Bad request"
            })
            return
        }

        try {
            const updatedChat = await Chat.findByIdAndUpdate(
                userId,
                {
                    chatName
                },
                {
                    new: true
                }
            ).populate("users", "-password").populate("groupAdmin", "-password")


            if (updatedChat) {
                res.status(200).send(updatedChat)
            } else {
                res.status(403).send({
                    "error": "No chat found!!"
                })
            }
        } catch (error) {
            console.log("error: ", error);
        }
    } else {
        console.log("renameGroupChats", err);
    }
})

const addToGroup = asyncHandler(async (req, res, next, err) => {
    if (!err) {
        const { chatId, userId } = req.body

        if (!chatId || !userId) {
            res.status(400).send({
                "error": "Bad request"
            })
            return
        }

        const addedGroup = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId }
            },
            {
                new: true
            }
        ).populate("users", "-password").populate("groupAdmin", "-password")

        if (addedGroup) {
            res.status(200).send(addedGroup)
        } else {
            res.status(403).send({
                "error": "Not user found in group!!"
            })
        }

    } else {
        console.log("addToGroup", err);
    }
})

const removeToGroup = asyncHandler(async (req, res, next, err) => {
    if (!err) {
        const { chatId, userId } = req.body

        if (!chatId || !userId) {
            res.status(400).send({
                "error": "Bad request"
            })
            return
        }

        const removedGroup = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId }
            },
            {
                new: true
            }
        ).populate("users", "-password").populate("groupAdmin", "-password")


        if (removeToGroup) {
            res.status(200).send(removedGroup)
        } else {
            res.status(403).send({
                "error": "Not user found in group!!"
            })
        }

    } else {
        console.log("removeToGroup", err);
    }
})

module.exports = { accessChat, fetchAllChats, createGroupChats, renameGroupChats, addToGroup, removeToGroup }