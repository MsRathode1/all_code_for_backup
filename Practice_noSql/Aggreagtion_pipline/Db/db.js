const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        const connection = await mongoose.connect("mongodb+srv://rvrathore689:rdZmcgDzeObjvjDH@cluster0.pslfaz7.mongodb.net/Practice")
        console.log("connected to:", connection.connection.host);
    } catch (error) {
        console.log("Error in connect to db: ", error);
        process.exit(1)
    }
}

module.exports = connectDb