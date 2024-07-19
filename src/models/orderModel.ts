import mongoose, { Schema, Document } from "mongoose";

interface OrderInterface extends Document {
    productId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    amount: Number,
    razorpay_payment_id: String,
    razorpay_order_id: String,
    status: String,
    paymentStatus: String,
    referenceNo: String,
    address?: Schema.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
}

const orderSchema = new Schema<OrderInterface>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    referenceNo: {
        type: String,
        required: true,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "Address"
    }
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model<OrderInterface>("Order", orderSchema);

export default Order;