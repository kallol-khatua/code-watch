import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"
import sendVerifyEmail from "@/email/verifyemail"

dbConnect();

export async function POST(request: NextRequest) {

    const body = await request.json();

    const existingUserByUsername = await User.findOne({ username: body.username })
    if (existingUserByUsername) {
        return NextResponse.json(
            {
                success: false,
                message: "Username already taken"
            },
            {
                status: 400
            }
        )
    }

    const existingUserByEmail = await User.findOne({ email: body.email });
    if (existingUserByEmail) {
        return NextResponse.json(
            {
                success: false,
                message: "User with this email already exist"
            },
            {
                status: 400
            }
        )
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        const newUSer = new User({
            username: body.username,
            email: body.email,
            password: hashedPassword
        })

        const createdUser = await newUSer.save();
        
        const token = jwt.sign({ _id: createdUser._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        
        await sendVerifyEmail(body.email, token);
        
        return NextResponse.json(
            {
                success: true,
                message: "Verification email sent to your email",
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.log("Error while registering user", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while registering user"
            },
            {
                status: 500
            }
        )
    }
}