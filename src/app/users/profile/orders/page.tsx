"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function CancelOrder({
  isOpen,
  onClose,
  cancelOrderId,
  setIsCanceledOrder,
}: any) {
  const [formData, setFormData] = useState({
    reason: "",
    orderId: "",
  });
  const router = useRouter();
  setIsCanceledOrder(false);

  if (!isOpen) return null;

  const handleOrderCancel = async (e: any) => {
    e.preventDefault();
    formData.orderId = cancelOrderId;
    // console.log(formData);
    try {
      const response = await axios.patch(
        "/api/users/profile/orders/cancelorder",
        formData
      );
      if (response?.status === 200) {
        setFormData({
          reason: "",
          orderId: "",
        });
        setIsCanceledOrder(true);
        toast.success(response.data.message);
        onClose();
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error("Login first");
        router.push("/users/login");
      }
    }
  };

  const handleClose = () => {
    setFormData({
      reason: "",
      orderId: "",
    });
    onClose();
  };

  return (
    <div className="fixed min-h-screen pt-20 md:pt-0 overflow-y-scroll inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white mb-5 rounded-lg p-6 min-w-80 md:w-1/3 sm:min-w-96">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold">Cancel order</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="mt-4">
          <form className="max-w-md mx-auto" onSubmit={handleOrderCancel}>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="reason"
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Reason"
                required
              />
            </div>
            <button
              type="submit"
              className="text-white w full bg-blue-600 hover:bg-blue-700 font-medium rounded-lg w-full  px-5 py-2.5 text-center"
            >
              Cancel Order
            </button>
          </form>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className="w-full border border-red-400 text-black px-4 py-2 rounded-lg hover:text-white hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderDetail({
  orderDetail,
  setIsCanceledOrder,
}: any): React.JSX.Element {
  const [cancelOrderId, setCancelOrderId] = useState("");
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  //   order date
  const utcDate = new Date(orderDetail.createdAt);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(utcDate.getTime() + istOffset);
  const dd = String(istDate.getUTCDate()).padStart(2, "0");
  const mm = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = istDate.getUTCFullYear();
  const formattedDate = `${dd}.${mm}.${yyyy}`;
  const router = useRouter();

  const cancelOrderInitiation = (orderId: any) => {
    setCancelOrderId(orderId);
    setIsCancellingOrder(true);
  };

  const closeCancelOrderInitiation = () => {
    setCancelOrderId("");
    setIsCancellingOrder(false);
  };

  const handleOrderAgain = (productId: any) => {
    router.push(`/products?productId=${productId}`)
  }

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
            onClick={() => cancelOrderInitiation(orderDetail._id)}
          >
            Cancel order
          </button>
        )}
        {(orderDetail.status === "Completed" ||
          orderDetail.status === "Cancelled") && (
          <button
            type="button"
            className="w-full rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800"
            onClick={() => handleOrderAgain(orderDetail.productId)}
          >
            Order again
          </button>
        )}
        <Link href={`/users/profile/orders/viewdetails?orderId=${orderDetail.referenceNo}`} className="w-full cursor-pointer inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100">
          View details
        </Link>
      </div>

      <CancelOrder
        isOpen={isCancellingOrder}
        onClose={closeCancelOrderInitiation}
        cancelOrderId={cancelOrderId}
        setIsCanceledOrder={setIsCanceledOrder}
      />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [orders, setOrders]: any = useState([]);
  const [isCanceledOrder, setIsCanceledOrder] = useState(false);
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
  }, [isCanceledOrder, router]);

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
                  return (
                    <OrderDetail
                      key={idx}
                      orderDetail={order}
                      setIsCanceledOrder={setIsCanceledOrder}
                    />
                  );
                })
              : ""}
          </div>
        </div>
      </section>
    </div>
  );
}
