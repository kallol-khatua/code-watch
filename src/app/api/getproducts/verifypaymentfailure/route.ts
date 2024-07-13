import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"
import Order from "@/models/orderModel"

dbConnect();

export async function POST(request: NextRequest) {
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

        const body = await request.json();

        let newPayment = new Order({
            productId: body.productId,
            userId: user._id,
            amount: Number(body.amount) / 100,
            razorpay_payment_id: body.razorpay_payment_id,
            razorpay_order_id: body.razorpay_order_id,
            status: "failed"
        })
        await newPayment.save();

        return NextResponse.json(
            {
                success: true,
                message: "Payment status saved",
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error verifying payment success", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error saving payment failure status"
            },
            {
                status: 500
            }
        )
    }
}