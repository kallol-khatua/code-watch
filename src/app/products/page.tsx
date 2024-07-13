/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

export default function ProductByIDPage() {
  const [product, setProduct]: any = useState([]);
  const searchParams = useSearchParams();
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
      const response = await axios.post(`/api/getproducts/${productId}`, {
        amount: product?.offeredPrice,
      });

      if (response.status === 200) {
        const key = response.data.key;
        const order = response.data.order;

        const options = {
          key,
          amount: order.amount,
          currency: order.currency,
          name: "Next JS E-Commerce by Kallol",
          description: "Next JS E-Commerce by Kallol",
          order_id: order.id,
          handler: async function (response: any) {
            let paymentResponse = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              order_id: order.id,
              productId,
            };

            try {
              const verifyResponse = await axios.post(
                `/api/getproducts/verifypaymentsuccess`,
                paymentResponse
              );

              // after successfull payment send to all order page
              if (verifyResponse.status === 200) {
                // toast.success(verifyResponse.data.message);
                // navigate(`/advertiser/campaings/${campaignId}`);
              }
            } catch (error) {
              console.log(error);
            }
          },
          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", async function (response: any) {
          paymentObject.close();
          console.log(response);
          try {
            let failureResponse = {
              razorpay_payment_id: response.error.metadata.payment_id,
              razorpay_order_id: response.error.metadata.order_id,
              amount: order.amount,
              productId,
            };

            const verifyResponse = await axios.post(
              `/api/getproducts/verifypaymentfailure`,
              failureResponse
            );

            // payment failed redirect
          } catch (error) {
            console.log(error);
          }
        });
      }
    } catch (error) {
      console.log(error);
      // handle not login 401 error
    }
  };

  return (
    <main className="flex-col md:flex-row justify-center flex gap-4 items-start mx-4 py-12">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
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
  );
}
