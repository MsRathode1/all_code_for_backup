const async_handler = require("express-async-handler")
const Product = require("../Models/productModal")


const addProduct = async_handler(
    async (req, res) => {
        try {
            const { productCode, productPrice, productName } = req.body
            if ((!productCode || productCode == "") && (!productPrice || productPrice == "") && (!productName || productName == "")) {
                res.status(400).send({
                    "error": "Bad Request"
                })
                return
            } else {

                const productExist = await Product.find({
                    $or: [
                        { productCode: productCode },
                        { productName: productName }
                    ]
                })


                if (productExist == null) {
                    res.status(400).send({
                        "error": "Product already exist!!"
                    })
                    return
                }

                const product = await Product.create({
                    productName,
                    productPrice,
                    productCode
                })

                if (product) {
                    res.status(200).send({
                        "message": "Success",
                        "status": "ok",
                        "data": product
                    })
                } else {
                    res.status(400).send({
                        "error": "Something went wrong!!"
                    })
                    return
                }
            }
        } catch (error) {
            console.log("addProduct: ", error);
        }
    }
)

const fetchAllProduct = async_handler(
    async (req, res) => {
        const allProducts = await Product.find({})
        res.status(200).send(allProducts)
    }
)


const updateProduct = async_handler(
    async (req, res) => {
        const { productCode, productName, productPrice } = req.body
        if ((!productCode || productCode == "") && (!productPrice || productPrice == "") && (!productName || productName == "")) {
            res.status(400).send({
                "error": "Bad request!!"
            })
            return
        } else {
            const productExist = await Product.findOne({
                productCode
            })
            if (productExist == null) {
                res.status(400).send({
                    "error": "No product exist with give ProductCode!!"
                })
                return
            } else {
                const product = await Product.updateOne({ "productCode": productCode }, {
                    $set: {
                        "productName": productName,
                        "productPrice": productPrice
                    }
                })
                if (product) {
                    res.status(200).send({
                        "message": "Successfuly updated!!",
                        "staus": "ok",
                    })
                } else {
                    res.status(400).send({
                        "error": "Something went wrong!!"
                    })
                }
            }
        }
    }

)

const deleteProduct = async_handler(async (req, res) => {
    try {
        const { productCode } = req.body
        if (!productCode || productCode == "") {
            res.status(400).send({
                "error": "Bad request!!"
            })
            return
        } else {
            const productExist = await Product.findOne({
                productCode
            })

            if (productExist == null) {
                res.status(400).send({
                    "error": "no product found with given productCode!!"
                })
            } else {
                const product = await Product.deleteOne({
                    "productCode": productCode
                })

                console.log("product: ", product);

                if (product) {
                    res.status(200).send({
                        "message": "Successfully deleted!!"
                    })
                } else {
                    res.status(400).send({
                        "message": "Something went wrong!!"
                    })
                }
            }
        }
    } catch (error) {
        console.log("error: ", error);
    }
})


const arthmeticOpertions = async_handler(async (req, res) => {
    //    const result = await Product.aggregate([
    //     {
    //       $group: {
    //         _id: null,
    //         maxPrice: { $max: "$productPrice" },
    //         minPrice: { $min: "$productPrice" },
    //         avgPrice: { $avg: "$productPrice" }
    //       }
    //     }
    //   ])

    const result = await Product.aggregate([
        { $sort: { "productPrice": -1 } },  // Sort by salary in descending order
        { $group: { _id: null, productPrices: { $push: "$productPrice" } } }, // Group all salaries into an array
        { $project: { secondHighest: { $arrayElemAt: ["$productPrices", 1] } } } // Get the second element from the salaries array
    ])

    res.send(result)
})

module.exports = { addProduct, fetchAllProduct, updateProduct, deleteProduct, arthmeticOpertions }