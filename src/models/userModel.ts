import mongoose, { Schema, Document } from "mongoose";

interface UserInterface extends Document{
    username: string,
    email: string,
    password: string,
    isEmailVerified: boolean,
    createdAt?: Date,
    updatedAt?: Date,
}

const userSchema = new Schema<UserInterface>({
    username: {
        type: String,
        required: [true, "Please provide an username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model<UserInterface>("User", userSchema);

export default User;