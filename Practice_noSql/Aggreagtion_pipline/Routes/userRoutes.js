const aggregate = require("../Controllers/aggregate")
const User = require("../Models/userModel")
const Router = require("express").Router()

Router.route("/").post(async (req, res) => {
  const result = await User.create({
    userName: "r",
    userEmail: "sdf@",
    userPassword: "14fs58"
  });

  // const result = await User.find({})
  console.log("result", result);
  return
})

module.exports = Router