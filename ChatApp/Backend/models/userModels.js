const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const uniqueValidator = require("mongoose-unique-validator")

const userModle1 = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-850.jpg?w=740&t=st=1707383495~exp=1707384095~hmac=2d239f5946cd82532ae5e037336312a32cfae3b2eebda9603139bd57a337c998"
    }

}, {
    timestamps: true
})

userModle1.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userModle1.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model("users", userModle1)