const uploadOnCloudinary = require("../utils/cloudinary");


const userRegister = async (req, res) => {
   const{ userName} = req.body
   console.log("req.body: ", req.file.path);
   console.log("userName: ", userName);
   res.send("running")
   const result = uploadOnCloudinary(req.file.path)
   console.log("result: ", result);
}

module.exports = userRegister