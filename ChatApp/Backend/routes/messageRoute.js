const express = require("express")
const { authToken } = require("../middlewares/authenticationMiddleware")
const { messageSend, fetchSingleChat } = require("../controllers/messageControllers")
const router = express.Router()


router.route("/sendMessage").post(authToken, messageSend)
router.route("/fetchSingle/:chatId").get(authToken, fetchSingleChat)



module.exports = router