import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay";
import jwt from "jsonwebtoken"
import User from "@/models/userModel"
import Address from "@/models/addressModel"

dbConnect();

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

        const addresses = await Address.find({ user: user._id });

        return NextResponse.json(
            {
                success: true,
                message: "Address saved",
                addresses
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error creating order", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error creating order"
            },
            {
                status: 500
            }
        )
    }
}

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

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!
        })

        const options: any = {
            amount: Number(body.amount) * 100,
            currency: "INR",
            notes: [user._id, "Code Watch", body.productId]
        };

        const order = await instance.orders.create(options);

        return NextResponse.json(
            {
                success: true,
                message: "Order created",
                order,
                key: process.env.RAZORPAY_KEY_ID!
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error creating order", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error creating order"
            },
            {
                status: 500
            }
        )
    }
}