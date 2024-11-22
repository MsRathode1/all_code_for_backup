const jwt = require("jsonwebtoken")
const User = require("../models/userModels")
const dotenv = require("dotenv")
dotenv.config()

const authToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).send({ error: 'Invalid token' });
                } else if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({ error: 'Token expired' });
                } else {
                    return res.status(500).send({ error: 'Internal server error' });
                }
            } else {
                req.user = await User.findById(decoded.user._id).select('-password')
                next()
            }
        })

    } else {
        res.status(401).send({ "error": "Unauthorized" })
    }
}

module.exports = { authToken }