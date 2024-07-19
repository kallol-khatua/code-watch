import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"
import Order from "@/models/orderModel"
import CancelOrder from "@/models/cancelOrderModel"

dbConnect()

export async function PATCH(request: NextRequest) {
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

        const data = await request.json();

        let newCancelOrder = new CancelOrder({
            user: user._id,
            orderId: data.orderId,
            reason: data.reason,
        })
        await newCancelOrder.save();

        await Order.findOneAndUpdate({_id: data.orderId}, {status: "Cancelled"})

        return NextResponse.json(
            {
                success: true,
                message: "Order cancelled",
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error while cancelling order", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error while cancelling order"
            },
            {
                status: 500
            }
        )
    }
}