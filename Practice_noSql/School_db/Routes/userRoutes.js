const express = require("express")
const userRegister = require("../Controllers/userRegester")
const router = express.Router()
const upload = require("../utils/multer.js")


router.route("/userSignIn").post(upload.single("pic"), userRegister)


module.exports = router