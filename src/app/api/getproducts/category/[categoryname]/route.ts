import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import Product from "@/models/productModel"

dbConnect();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const categoryName = url.pathname.split('/').pop()

        const products = await Product.find({category: categoryName});

        return NextResponse.json(
            {
                success: true,
                message: "Products found",
                products,
            },
            {
                status: 200,
            }
        )
    } catch (error) {
        console.log("Error while fetching products", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while fetching products"
            },
            {
                status: 500
            }
        )
    }
}