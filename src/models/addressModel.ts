import mongoose, { Schema, Document } from "mongoose";

interface AddressInterface extends Document {
    user: Schema.Types.ObjectId,
    name: String,
    phone_number: String,
    pincode: String,
    state: String,
    city: String,
    house: String,
    area: String,
    landmark?: String,
    createdAt?: Date,
    updatedAt?: Date,
}

const addressSchema = new Schema<AddressInterface>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    house: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
    },
}, { timestamps: true })

const Address = mongoose.models.Address || mongoose.model<AddressInterface>("Address", addressSchema);

export default Address;