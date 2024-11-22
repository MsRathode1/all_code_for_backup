const dotenv = require("dotenv")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const connectDB = require("../db/db")


const db = connectDB()
dotenv.config()

console.log("key", process.env.JWT_KEY);
const genrateToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '12h' })
}


const registerUser = async (req, res   ) => {
    try {
        const { username, password, userType } = req.body
        if (!username || !password || !userType) {
            res.status(400).send({
                "error": "Something went wrong!!"
            })
            return
        } else {
            db.query('SELECT COUNT(*) AS count FROM users WHERE username = ?', [username], async (err, result) => {
                if (!err) {
                    if (result[0].count > 0) {
                        res.status(400).send({
                            "error": "User already exist!!"
                        })
                        return
                    } else {
                        const hashedPassword = await bcrypt.hash(password, 10);
                        db.query("INSERT INTO users (username, password, user_type) VALUES (?,?,?)", [username, hashedPassword, userType], (err, result) => {
                            if (!err) {
                                res.status(200).send({
                                    error: null,
                                    user: {
                                        username,
                                        userType,
                                        userid: result.insertId
                                    },
                                    token: genrateToken({ username, userType, userid: result.insertId }),
                                    message: "User regiserted successfully!!"
                                })
                                return
                            } else {
                                res.status(400).send({
                                    "error": "Failed to create the user!!"
                                })
                                console.log("err inserting user:", err)
                            }
                        })
                    }
                } else {
                    console.log(err);
                }
            })


        }
    } catch (error) {
        console.log("error: ", error);
        res.send(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const USER = req.user
        const { username, password } = req.body
        if (!username || !password) {
            res.status(400).send({
                "error": "Something Went Wrong!!"
            })
            return
        } else {
            db.query("select password from users where user_id=?", [USER.user_id], async (err, result) => {
                if (!err) {
                    if (result[0].password) {
                        const isPasswordMatch = await bcrypt.compare(password, result[0].password)
                        if (isPasswordMatch) {
                            res.status(200).send({
                                "Message": "Logged in Successfuly!!"
                            })
                            return
                        } else {
                            res.status(400).send({
                                "error": "Password Not Matched!!"
                            })
                            return
                        }
                    }
                }
            })
        }
    } catch (error) {
        console.log("errorloginUser: ", error);
    }
}




module.exports = { registerUser, loginUser }