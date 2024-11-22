const mongoose = require("mongoose")


const connectionToDb = async () => {
    try {
        const connect = await mongoose.connect("mongodb://localhost:27017/crud_app_i")
        console.log(connect.connection.host);
    } catch (error) {
        console.log("error: ", error);
        process.exit()
    }
}

module.exports = connectionToDb