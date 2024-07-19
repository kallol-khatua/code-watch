/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ProductByIDPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [product, setProduct]: any = useState([]);
  const productId = searchParams.get("productId");

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/api/getproducts/${productId}`);
        setProduct(response.data.product);
      } catch (error) {
        console.log("Error while fetching products");
      }
    }
    getData();
  }, []);

  const handleAddToBag = (productId: any) => {
    console.log(productId);
    // let bagItem: any = localStorage.getItem("bagItem");
    // let index = bagItem.findIndex((item: any) => item === productId)
    // if(index === -1){
    //   // handle not present
    // } else {
    //   // handle present
    // }
  };

  const handleBuyNow = async () => {
    if (!product) {
      return;
    }
    try {
      // creating order from razorpay
      const response = await axios.post(`/api/getproducts/${productId}`);

      if (response.status === 200) {
        router.push(`/products/buynow?productId=${product._id}`)
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 401) {
        toast.error("Login first");
        router.push("/users/login");
      }
    }
  };

  return (
    <>
      {/* <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      /> */}
      <main className="flex-col md:flex-row justify-center flex gap-4 items-start mx-4 py-12">
        <Toaster />
        {product && (
          <div className="flex bg-white rounded-lg shadow flex-col md:flex-row md:max-w-screen-lg">
            <div className="w-full md:w-48 md:min-w-40">
              <img
                src={product.image}
                alt="product image"
                className="w-72 object- w-full  md:h-full"
              />
            </div>
            <form className="flex-auto p-6 bg-white">
              <div>
                <h1 className="flex-auto text-xl font-semibold text-black">
                  {product.name}
                </h1>
                <div>
                  <p>Colour: {product.color}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-black cursor-auto">
                    {product?.offeredPrice?.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                  <del>
                    <p className="text-sm text-gray-600 cursor-auto ml-2">
                      {product?.originalPrice?.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                  </del>
                </div>
              </div>

              <div className="mt-2 text-sm font-medium">
                <button
                  onClick={() => handleAddToBag(product?._id)}
                  type="button"
                  className="py-2 px-4 bg-amber-400 hover:bg-amber-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg "
                >
                  Add to bag
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-2 mt-2 px-4 bg-orange-600 hover:bg-orange-700 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg "
                >
                  Buy now
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
