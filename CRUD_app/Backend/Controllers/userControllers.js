const async_handler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../Models/useModel")

const genrateToken = (user) => {
    return jwt.sign({ user }, "CRUD", { expiresIn: "1h" })
}

const userSignUp = async_handler(
    async (req, res, next) => {
        try {
            const { email, password } = req.body
            if (!email && !password) {
                res.status(400).send({
                    "error": "Bad request"
                })
                return
            } else {
                const userExist = await User.findOne({ email })
                if (userExist) {
                    res.status(406).send({
                        "error": "User already exist!!"
                    })
                    return
                } else {
                    if (email != "" && password != "") {
                        const user = await User.create({
                            email, password
                        }).select("-password")


                        if (user) {
                            res.status(200).send({
                                "message": "success",
                                "status": "ok",
                                "data": user,
                                "token": genrateToken(user)
                            })
                        } else {
                            res.status(400).send({
                                "error": "No user found!!",
                            })
                        }
                    } else {
                        res.status(400).send({
                            "error": "Bad Request"
                        })
                    }

                }
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }
)

const userLogin = async_handler(async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email && !password) {
            res.status(400).send({
                "error": "Bad request!!"
            })
            return
        } else {
            if (email !== "" && password !== "") {
                console.log("email : ", email );
                const user = await User.findOne({ email })
                console.log("user: ", user);
                if (user) {
                    if (await user.matchpassword(password)) {
                        res.status(200).send({
                            "message": "success",
                            "status": "ok",
                            "data": {
                                "id": user._id,
                                "email": user.email,
                                "profilePic": user.profilePic,
                                "token": genrateToken(user)
                            }
                        })
                    } else {
                        res.status(400).send({
                            "error": "Password is wrong!!"
                        })
                        return
                    }
                } else {
                    res.status(400).send({
                        "error": "Email is wrong!!"
                    })
                    return
                }
            } else {
                res.status(400).send({
                    "error": "Bad request!!"
                })
            }
        }
    } catch (error) {
        console.log("error: ", error);

    }
})

module.exports = { userSignUp, userLogin }