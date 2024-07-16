import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/userModel"
import Address from "@/models/addressModel"

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
        console.log("Error while fetching addresses", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error while fetching addresses"
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

        const data = await request.json();
        const newAddress = new Address({
            ...data,
            user: user._id
        });
        await newAddress.save();

        return NextResponse.json(
            {
                success: true,
                message: "Address saved"
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.log("Error while saving new address", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error while saving new address"
            },
            {
                status: 500
            }
        )
    }
}