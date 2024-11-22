const asyncHandler = require('express-async-handler')
const User = require("../models/userModels")
const JWT = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const genrateJwtToken = (user) => {
    return JWT.sign({ user }, process.env.JWT_KEY, { expiresIn: '12h' })
}

const registerUser = asyncHandler(
    async (req, res, next, err) => {
        if (!err) {
            const { name, email, password, profilePic } = req.body
            console.log("req.body: ", req.body);
            if (!name || !email || !password) {
                res.status(400).send({
                    "error": "Something Went Wrong!!"
                })
                return
            }

            const userExits = await User.findOne({ email })
            if (userExits) {
                res.status(400).send({
                    "error": "User Already exist!!"

                })
                return
            } else {
                const user = User.create({
                    name,
                    email,
                    password,
                    profilePic,

                })

                if (user) {
                    res.status(200).send({
                        "error": null,
                        "status": "ok",
                        "message": "SignUp Successfully.",
                        "data": {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            profilePic: user.profilePic,
                            token: genrateJwtToken(user)
                        }
                    })
                } else {
                    res.status(400).send({
                        "error": "Failed to create the user!!"
                    })
                }
            }


        } else {
            console.log("error;-", err);
            res.send(err)
        }
    }

)

const authUser = asyncHandler(
    async (req, res, next, err) => {
        try {
            if (!err) {
                const { email, password } = req.body
                const user = await User.findOne({ email })
                if (!email || !password) {
                    res.status(400).send({
                        "error": "Something went wrong!!"
                    })
                    return
                }

                if (user && (await user.matchPassword(password))) {
                    res.status(200).send({
                        "error": null,
                        "status": "ok",
                        "message": "LogIn Successfully.",
                        "data": {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            profilePic: user.profilePic,
                            token: genrateJwtToken(user)
                        }
                    })
                } else {
                    res.status(400).send({
                        "error": "Password or Email incorrect!!"
                    })
                    return
                }
            } else {
                console.log(err);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }
)

const searchUser = asyncHandler(
    async (req, res, next, err) => {
        if (!err) {
            try {
                const searchQuery = req.query
                if (Object.keys(searchQuery).length !== 0) {
                    if (searchQuery.search !== "" && searchQuery.search !== undefined) {
                        searchResult = await User.find({
                            $or: [
                                { name: { $regex: req.query.search, $options: "i" } },
                                { email: { $regex: req.query.search, $options: "i" } }
                            ]
                        }).select('-password')
                    } else {
                        res.status(400).send({
                            "error": "No query found!!"
                        })
                        return
                    }
                    if (searchResult.length !== 0) {
                        res.status(200).send({
                            "message": "success",
                            "status": "ok",
                            "data": searchResult
                        })
                    } else {
                        res.status(203).send({
                            "message": "not data found",
                            "status": "ok",
                            "data": searchResult
                        })
                        return
                    }
                } else {
                    res.status(400).send({
                        "error": "Bad request!!"
                    })
                }
            } catch (error) {
                console.log("error: ", error);
            }
        } else {
            console.log(err);
        }
    }
)

module.exports = { registerUser, authUser, searchUser }