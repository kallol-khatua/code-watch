import mongoose, { Schema, Document } from "mongoose";

interface ProductInterface extends Document {
    image: string,
    name: string,
    color: string,
    originalPrice: Number,
    offeredPrice: Number,
    category: String,
    brand: String,
    createdAt?: Date,
    updatedAt?: Date,
}

const productSchema = new Schema<ProductInterface>({
    image: {
        type: String,
        required: [true, "Please provide an image"],
    },
    name: {
        type: String,
        required: [true, "Please provide an name"],
    },
    originalPrice: {
        type: Number,
        required: true
    },
    offeredPrice: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model<ProductInterface>("Product", productSchema);

export default Product;