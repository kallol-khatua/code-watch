"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function OrderDetail({ orderDetail }: any): React.JSX.Element {
  //   order date
  const utcDate = new Date(orderDetail.createdAt);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(utcDate.getTime() + istOffset);
  const dd = String(istDate.getUTCDate()).padStart(2, "0");
  const mm = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = istDate.getUTCFullYear();
  const formattedDate = `${dd}.${mm}.${yyyy}`;
  return (
    <div className="flex flex-wrap items-center gap-y-4 py-6">
      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
        <dt className="text-base font-medium text-gray-500">Order ID:</dt>
        <dd className="mt-1.5 text-base font-semibold text-gray-900">
          {/* <a href="#" className="hover:underline"> */}
          {orderDetail.referenceNo}
          {/* </a> */}
        </dd>
      </dl>

      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
        <dt className="text-base font-medium text-gray-500 ">Order date:</dt>
        <dd className="mt-1.5 text-base font-semibold text-gray-900 ">
          {formattedDate}
        </dd>
      </dl>

      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
        <dt className="text-base font-medium text-gray-500 ">Total price:</dt>
        <dd className="mt-1.5 text-base font-semibold text-gray-900 ">
          {orderDetail.amount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </dd>
      </dl>

      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
        <dt className="text-base font-medium text-gray-500">Status:</dt>
        {orderDetail.status === "Order Placed" && (
          <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
            <svg
              className="me-1 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
              />
            </svg>
            Order Placed
          </dd>
        )}
        {orderDetail.status === "In transit" && (
          <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <svg
              className="me-1 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
              />
            </svg>
            In transit
          </dd>
        )}
        {orderDetail.status === "Completed" && (
          <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <svg
              className="me-1 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 11.917 9.724 16.5 19 7.5"
              />
            </svg>
            Completed
          </dd>
        )}
        {orderDetail.status === "Cancelled" && (
          <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <svg
              className="me-1 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
            Cancelled
          </dd>
        )}
      </dl>

      <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
        {(orderDetail.status === "In transit" ||
          orderDetail.status === "Order Placed") && (
          <button
            type="button"
            className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white"
          >
            Cancel order
          </button>
        )}
        {(orderDetail.status === "Completed" ||
          orderDetail.status === "Cancelled") && (
          <button
            type="button"
            className="w-full rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 "
          >
            Order again
          </button>
        )}
        <a className="w-full cursor-pointer inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100">
          View details
        </a>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [orders, setOrders]: any = useState([]);
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("/api/users/profile/orders");

        setOrders(response.data.orders);
      } catch (error: any) {
        console.log("Error while fetching products", error);
        if (error?.response?.status === 401) {
          toast.error("Login first");
          router.push("/users/login");
        }
      }
    }
    getData();
  }, []);

  return (
    <div>
      <Toaster />
      <section className="bg-white py-8 antialiased md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                My orders
              </h2>

              {/* <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                <div>
                  <label
                    htmlFor="order-type"
                    className="sr-only mb-2 block text-sm font-medium text-gray-900 "
                  >
                    Select order type
                  </label>
                  <select
                    id="order-type"
                    className="block w-full min-w-[8rem] rounded-lg border border-gray-300  p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">All orders</option>
                    <option value="pre-order">Pre-order</option>
                    <option value="transit">In transit</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <span className="inline-block text-gray-500 "> from </span>

                <div>
                  <label
                    htmlFor="duration"
                    className="sr-only mb-2 block text-sm font-medium text-gray-900"
                  >
                    Select duration
                  </label>
                  <select
                    id="duration"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 "
                  >
                    <option selected>this week</option>
                    <option value="this month">this month</option>
                    <option value="last 3 months">the last 3 months</option>
                    <option value="lats 6 months">the last 6 months</option>
                    <option value="this year">this year</option>
                  </select>
                </div>
              </div> */}
            </div>

            {orders && orders.length > 0
              ? orders.map((order: any, idx: any) => {
                  return <OrderDetail key={idx} orderDetail={order} />;
                })
              : ""}
          </div>
        </div>
      </section>
    </div>
  );
}
