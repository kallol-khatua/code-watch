import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"
import Order from "@/models/orderModel"

dbConnect()

export async function GET(request: NextRequest) {
    try {
        const token: any = request.cookies.get("token");

        if (!token || !token?.value) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Access Denied: No token provided!"
                },
                {
                    status: 401
                }
            )
        }

        let user;
        try {
            const decode: any = jwt.verify(token.value, process.env.JWT_SECRET!)

            user = await User.findOne({ _id: decode._id });
            if (!user) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "User not found"
                    },
                    {
                        status: 401
                    }
                )
            }
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Token."
                },
                {
                    status: 401
                }
            )
        }

        let orders = await Order.find({ userId: user._id, paymentStatus: "captured" });

        return NextResponse.json(
            {
                success: true,
                message: "Data found",
                orders
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error while fetching all orders details", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error while fetching all orders"
            },
            {
                status: 500
            }
        )
    }
}