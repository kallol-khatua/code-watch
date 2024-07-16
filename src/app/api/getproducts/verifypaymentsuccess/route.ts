import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"
import Order from "@/models/orderModel"
import crypto from 'crypto'

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

        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.order_id + "|" + body.razorpay_payment_id)
            .digest('hex');

        if (generated_signature == body.razorpay_signature) {
            let newOrder = new Order({
                productId: body.productId,
                userId: user._id,
                amount: Number(body.amount) / 100,
                razorpay_payment_id: body.razorpay_payment_id,
                razorpay_order_id: body.razorpay_order_id,
                paymentStatus: "captured",
                status: "Order Placed",
                referenceNo: "NEC" + Date.now(),
            })
            await newOrder.save();

            return NextResponse.json(
                {
                    success: true,
                    message: "Payment status saved",
                },
                {
                    status: 200
                }
            )
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: "Payment signature not matched",
                },
                {
                    status: 400
                }
            )
        }
    } catch (error) {
        console.log("Error verifying payment success", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error verifying payment success"
            },
            {
                status: 500
            }
        )
    }
}