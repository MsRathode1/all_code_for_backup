const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: "https://imgs.search.brave.com/vPOtqwiB1YItfyOaJQinfRDR8ubBeV7LtPADMJY3CDg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9wdWIt/c3RhdGljLmZvdG9y/LmNvbS9hc3NldHMv/cHJvamVjdHMvcGFn/ZXMvODRmZTMzZmY0/NmM2NDI3ZTg1MmI1/MGYyMDFmZTliNjcv/Zm90b3ItOWFmMTM1/OWNjMzg3NDc2NWFh/Yjg3NmNjM2Q5ODcx/YzMuanBn"
    },
    password: {
        type: String,
        required: true,
    }
    
}, {
    timestamps: true
})


userSchema.methods.matchpassword = function (enteredPassword) {
    return this.password === enteredPassword
}


module.exports = mongoose.model("users", userSchema)