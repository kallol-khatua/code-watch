/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("/api/getproducts");
        setProducts(response.data.products);
      } catch (error) {
        console.log("Error while fetching products");
      }
    }
    getData();
  }, []);

  return (
    <main>
      <section
        id="products"
        className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
      >
        {products && products.length > 0 && (
          <>
            {products.map((product: any) => {
              return (
                <div
                  key={product._id}
                  className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                >
                  <Link href={`/products?productId=${product._id}`}>
                    <img
                      src={product.image}
                      alt="Product"
                      className="h-80 w-72 object-cover rounded-t-xl"
                    />
                    <div className="px-4 py-3 w-72">
                      <span className="text-gray-400 mr-3 uppercase text-xs">
                        {product.brand}
                      </span>
                      <p className="text-lg font-bold text-black truncate block capitalize">
                        {product.name}
                      </p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-black cursor-auto my-3">
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
                  </Link>
                </div>
              );
            })}
          </>
        )}
      </section>
    </main>
  );
}
