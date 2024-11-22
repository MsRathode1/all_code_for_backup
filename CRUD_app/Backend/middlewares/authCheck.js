const jwt = require("jsonwebtoken")


const authTokenCheck = async (req, res, next) => {
    let token = req.headers["authorization"]
    if (token) {
        token = token.split(" ")[1]
        jwt.verify(token, "CRUD", (err, decoded) => {
            if (err) {
                res.status(401).send({
                    "error": err
                })
            } else {
                req.user = decoded
                next()
            }
        })

    } else {
        res.status(401).send({
            "error": "unauthorised"
        })
    }
}

module.exports = authTokenCheck