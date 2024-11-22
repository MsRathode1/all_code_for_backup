const express = require("express")
const { authToken } = require("../middlewares/authenticationMiddleware")
const { accessChat, fetchAllChats, createGroupChats, renameGroupChats, addToGroup, removeToGroup } = require("../controllers/chatControllers")
const router = express.Router()

router.route("/").post(authToken, accessChat)
router.route('/fetchChats').get(authToken, fetchAllChats)
router.route('/createGroup').post(authToken, createGroupChats)
router.route("/renameGroup").put(authToken, renameGroupChats)
router.route("/removeGroup").put(authToken, removeToGroup)
router.route("/addToGroup").put(authToken, addToGroup)


module.exports = router