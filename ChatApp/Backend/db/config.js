const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectMongo = async () => {
    try {
        const conn = await mongoose.connect(process.env.mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("connected to:", conn.connection.host);
    } catch (error) {
        console.log("error: ", error.message);
        process.exit()
    }
}

module.exports = connectMongo