const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true
    },
    userPassword:{
        type:String,
        required:true
    }
}, {
    timestamps: true
})


const User = mongoose.model("User", userSchema)

module.exports = User