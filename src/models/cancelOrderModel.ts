import mongoose, { Schema, Document } from "mongoose";

interface CancelOrderInterface extends Document {
    user: Schema.Types.ObjectId,
    orderId: Schema.Types.ObjectId,
    reason: String,
    createdAt?: Date,
    updatedAt?: Date,
}

const cancelOrderSchema = new Schema<CancelOrderInterface>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    reason: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const CancelOrder = mongoose.models.CancelOrder || mongoose.model<CancelOrderInterface>("CancelOrder", cancelOrderSchema);

export default CancelOrder;