import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"

dbConnect();

export async function POST(request: NextRequest){
    const data: any = await request.json();

    try {
        const decode: any = jwt.verify(data.token, process.env.JWT_SECRET!)
        
        const user = await User.findOne({_id: decode._id});
        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 400
                }
            )
        }

        if(user.isEmailVerified){
            return NextResponse.json(
                {
                    success: true,
                    message: "Email already verified"
                },
                {
                    status: 200
                }
            )
        }

        user.isEmailVerified = true;
        await user.save()

        return NextResponse.json(
            {
                success: true,
                message: "Email verified"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("error while verifying verify email token", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while verifying token"
            },
            {
                status: 500
            }
        )
    }
}