const express = require("express")
const { registerUser, authUser, searchUser } = require('../controllers/userControllers')
const router = express.Router()
const { authToken } = require("../middlewares/authenticationMiddleware")


router.route('/SignUp').post(registerUser)
router.route('/login').post(authUser)
router.route('/searchUser').get(authToken,searchUser)


module.exports = router