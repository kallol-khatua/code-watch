/* eslint-disable @next/next/no-img-element */
"use client";

import axios from "axios";
import ProductCard from "@/components/products/productcard/productcard";
import { useEffect, useState } from "react";

export default function WomenWatches() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("/api/getproducts/category/women");
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
              return <ProductCard key={product._id} product={product} />;
            })}
          </>
        )}
      </section>
    </main>
  );
}
