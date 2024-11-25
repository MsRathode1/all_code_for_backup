const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: String,
        required: true
    },
    productCode: {
        type: Number,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("products", productSchema)