import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IoMdMore } from "react-icons/io";

function AddressDetail({ address, handleAddressesChange }: any) {
  return (
    <div className="border border-gray px-3 py-3 flex items-center">
      <div className="pr-2">
        <input
          name="address"
          type="radio"
          onClick={() => handleAddressesChange(address._id)}
        />
      </div>
      <div>
        <div className="flex justify-between">
          <div>{address.name}</div>
        </div>
        <div>
          {address.area}, {address.house}, {address.landmark}, {address.city},{" "}
          {address.state}, {address.pincode}
        </div>
        <div>{address.phone_number}</div>
      </div>
    </div>
  );
}

function AddNewAddress({ isOpen, onClose }: any) {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    pincode: "",
    state: "",
    city: "",
    house: "",
    area: "",
    landmark: "",
  });
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddressSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "/api/users/profile/addresses",
        formData
      );
      if (response?.status === 201) {
        setIsSubmitting(false);
        setFormData({
          name: "",
          phone_number: "",
          pincode: "",
          state: "",
          city: "",
          house: "",
          area: "",
          landmark: "",
        });
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
    setIsSubmitting(false);
    setFormData({
      name: "",
      phone_number: "",
      pincode: "",
      state: "",
      city: "",
      house: "",
      area: "",
      landmark: "",
    });
    onClose();
  };

  return (
    <div className="fixed min-h-screen pt-20 md:pt-0 overflow-y-scroll inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white mb-5 rounded-lg p-6 min-w-80 md:w-1/3 sm:min-w-96">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold">Add new address</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="mt-4">
          <form className="max-w-md mx-auto" onSubmit={handleAddressSubmit}>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
                placeholder="Full name *"
                autoFocus
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="phone_number"
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Phone number *"
                required
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="pincode"
                id="pincode"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Pincode *"
                required
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="state"
                id="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
                placeholder="State *"
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
                placeholder="City *"
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="house"
                id="house"
                value={formData.house}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
                placeholder="House no., Building name *"
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="area"
                id="area"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
                placeholder="Road name, Area, Colony *"
              />
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="landmark"
                id="landmark"
                value={formData.landmark}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Landmark"
              />
            </div>
            <button
              type="submit"
              className="text-white w full bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center"
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </button>
          </form>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className="w-full border border-red-400 text-black px-4 py-2 rounded-lg hover:text-white hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuyNowAddresses({
  handleAddressesChange,
}: any): React.JSX.Element {
  const [addresses, setAddresses]: any = useState([]);
  const [addNewAddress, setAddNewAddress] = useState(false);

  const handleAddNewAddress = () => setAddNewAddress(true);
  const closeAddNewAddress = () => setAddNewAddress(false);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/api/getproducts/createorder`);
        setAddresses(response.data.addresses);
      } catch (error) {
        console.log("Error while fetching addresses");
      }
    }
    getData();
  }, [addNewAddress]);

  return (
    <section className="bg-white antialiased">
      <Toaster />
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div>
            <div className="gap-4 mb-3 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Delivery Address
              </h2>
              <button
                type="button"
                className="rounded-lg border border-primary-200 px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-primary-50"
                onClick={handleAddNewAddress}
              >
                Add a new address
              </button>
            </div>
            <AddNewAddress
              isOpen={addNewAddress}
              onClose={closeAddNewAddress}
            />

            <div>
              {addresses &&
                addresses.length > 0 &&
                addresses.map((address: any, idx: any) => {
                  return (
                    <AddressDetail
                      key={idx}
                      address={address}
                      handleAddressesChange={handleAddressesChange}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
