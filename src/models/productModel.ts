import mongoose, { Schema, Document } from "mongoose";

interface ProductInterface extends Document{
    image: string,
    name: string,
    color: string,
    price: number,
    createdAt?: Date,
    updatedAt?: Date,
}

const productSchema = new Schema<ProductInterface>({
    image: {
        type: String,
        required: [true, "Please provide an image"],
    },
    name : {
        type: String,
        required: [true, "Please provide an name"],
    },
    color: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    }
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model<ProductInterface>("Product", productSchema);

export default Product;