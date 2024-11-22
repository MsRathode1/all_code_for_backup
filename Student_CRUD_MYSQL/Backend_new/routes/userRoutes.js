const express = require("express")
const { registerUser, loginUser } = require("../Controllers/userControllers")
const CheckToken = require("../middlewares/AuthTokenMiddleware")
const router = express.Router()


router.route("/signUp").post(registerUser)
router.route("/login").post(CheckToken, loginUser)

module.exports = router