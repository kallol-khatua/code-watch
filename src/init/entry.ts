
const Product = require("./productModel")
const watches = require("./data")
const mongoose = require("mongoose")

async function main() {
    await mongoose.connect(process.env.MONGO_URI)
}

main()
    .then(() => console.log("db connected successfully"))
    .catch((err) => console.log(err));



const productEntry = async () => {
    try {
        const data = await Product.insertMany(watches)
    } catch (error) {
        console.log(error)
    }
}

productEntry();