const v2 = require("cloudinary")
const fs = require("fs")


v2.config({
    cloud_name: "dc0zkt7hm",
    api_key: "773147225326473",
    api_secret: "stfHFUMxOgNePS1y2uqX5EX0D5E" // Click 'View Credentials' below to copy your API secret
});


const uploadOnCloudinary = async (path) => {
    console.log("path: ", path);
    try {
        if (path) {
            const uploadResult = await v2.uploader.upload(path, {
                resource_type: "auto"
            }).then((res) => {
                console.log("res: ", res);
            }).catch((error) => { console.log(error) });
            fs.unlinkSync(path)
            return uploadResult.url
        }
    } catch (error) {
        // fs.unlinkSync(path)
        return
    }
}


module.exports = uploadOnCloudinary