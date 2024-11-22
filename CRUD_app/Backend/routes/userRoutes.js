const express = require("express")
const {userSignUp, userLogin} = require("../Controllers/userControllers")
const router = express.Router()

router.route('/SignUp').post(userSignUp)
router.route('/login').post(userLogin)



module.exports = router