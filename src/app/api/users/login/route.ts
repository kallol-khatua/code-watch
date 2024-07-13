import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"

dbConnect();

export async function POST(request: NextRequest) {

    const body = await request.json();

    const existingUserByEmail = await User.findOne({ email: body.email });
    if (!existingUserByEmail) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid email address"
            },
            {
                status: 400
            }
        )
    }

    if (!existingUserByEmail.isEmailVerified) {
        return NextResponse.json(
            {
                success: false,
                message: "Email not verified"
            },
            {
                status: 400
            }
        )
    }

    try {
        const validPassword = await bcrypt.compare(body.password, existingUserByEmail.password);
        if (!validPassword) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid password"
                },
                {
                    status: 400
                }
            )
        }

        const token = jwt.sign({ _id: existingUserByEmail._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        let response = NextResponse.json(
            {
                success: true,
                message: "Login successfully",
            },
            {
                status: 200
            }
        )

        response.cookies.set("token", token);

        return response;
    } catch (error) {
        console.log("Error while loggedin user", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while loggedin user"
            },
            {
                status: 500
            }
        )
    }
}