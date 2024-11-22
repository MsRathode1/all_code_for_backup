const express = require("express")
const { addProduct, fetchAllProduct, updateProduct, deleteProduct, arthmeticOpertions } = require("../Controllers/productControllers")
const authTokenCheck = require("../middlewares/authCheck")
const router = express.Router()


router.route("/addProduct").post(addProduct)
router.route("/fetchAllProduct").get(authTokenCheck, fetchAllProduct)
router.route("/updateProduct").patch(authTokenCheck, updateProduct)
router.route("/deleteProduct").delete(authTokenCheck, deleteProduct)
router.route("/arthmatic").get(arthmeticOpertions)


module.exports = router