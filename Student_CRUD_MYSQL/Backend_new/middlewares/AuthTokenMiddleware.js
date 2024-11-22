const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const connectDB = require("../db/db")


const db = connectDB()
dotenv.config()


const CheckToken = async (req, res, next) => {
    const token = req.headers["authorization"]

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token is required.' })
    }

    try {

        jwt.verify(token.split(" ")[1], process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                if (err.name === "JsonWebTokenError") {
                    return res.status(401).send({ error: 'Invalid token' })
                } else if (err.name === "TokenExpiredError") {
                    return res.status(401).send({ error: 'Token expired' })
                } else {
                    return res.status(500).send({ error: 'Internal server error' })
                }
            } else {
                db.query("select user_id,username,user_type from users where user_id = ?", [decoded.user.userid], async (err, result) => {
                    if (!err) {
                        req.user = result[0]
                        next()
                    }

                })
            }
        })
    } catch (error) {

    }
}




module.exports = CheckToken