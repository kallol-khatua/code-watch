"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import toast, { Toaster } from "react-hot-toast";
import BuyNowAddresses from "@/components/products/buynow/addresses";

export default function BuyNowPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [product, setProduct]: any = useState([]);

  const productId = searchParams.get("productId");

  const [address, setAddress]: any = useState();

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

  const createorder = async () => {
    if (!product) {
      return;
    }
    if (!address) {
      alert("Choose an address");
      return;
    }
    try {
      // creating order from razorpay
      const response = await axios.post(`/api/getproducts/createorder`, {
        amount: product?.offeredPrice,
        productId,
      });

      if (response.status === 200) {
        const key = response.data.key;
        const order = response.data.order;

        const options = {
          key,
          amount: order.amount,
          currency: order.currency,
          name: "Code Watch",
          description: "Code Watch E-Commerce by Kallol",
          order_id: order.id,
          image: "/logo-no-background.svg",
          handler: async function (response: any) {
            let paymentResponse = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
              order_id: order.id,
              productId,
              address,
            };

            try {
              const verifyResponse = await axios.post(
                `/api/getproducts/verifypaymentsuccess`,
                paymentResponse
              );

              // after successfull payment send to all order page
              if (verifyResponse.status === 200) {
                router.replace("/users/profile/orders");
              }
            } catch (error: any) {
              console.log(error);
              if (error?.response?.status === 401) {
                toast.error("Login first");
                router.push("/users/login");
              }
            }
          },
          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", async function (response: any) {
          paymentObject.close();

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
          } catch (error: any) {
            console.log(error);
            if (error?.response?.status === 401) {
              toast.error("Login first");
              router.push("/users/login");
            }
          }
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 401) {
        toast.error("Login first");
        router.push("/users/login");
      }
    }
  };

  const handleAddressesChange = async (deliveryAddress: any) => {
    setAddress(deliveryAddress);
  };

  return (
    <section className="bg-white antialiased">
      <Toaster />
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <BuyNowAddresses handleAddressesChange={handleAddressesChange} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={createorder}
              className="py-2 mt-2 px-4 bg-orange-600 hover:bg-orange-700 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg "
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
