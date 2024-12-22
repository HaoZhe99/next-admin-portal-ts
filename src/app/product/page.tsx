"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
const { map, isEmpty } = require("lodash");

const ProductPage = () => {
  const [productList, setProductList] = useState<Product[]>([]);

  type Product = {
    id: string;
    name: string;
    price: number;
    status: string;
  };

  type FetchProductResponse = Product[];

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async (): Promise<void> => {
    try {
      const res = await fetch("/api/product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const product: FetchProductResponse = await res.json();

        setProductList(product);

        // Show success alert
        alert("Product list fetched successfully!");
      } else {
        const error = await res.json();
        console.error(error.message || "Something went wrong!");

        // Show error alert
        alert(error.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);

      // Show error alert
      alert("An error occurred. Please try again.");
    }
  };

  // @ts-ignore
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Product" />

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4 py-6 md:px-6 xl:px-7.5">
            <Link
              href="/product/create"
              className="inline-flex items-center justify-center rounded-md border border-black px-6 py-2 text-center font-medium text-black hover:bg-opacity-90"
            >
              Create
            </Link>
          </div>

          <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Product Image</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Product Name</p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="font-medium">Price</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Price</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">Action</p>
            </div>
          </div>

          {map(productList, (product: any, key: number) => {
            return (
              <div
                className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                key={key}
              >
                <div className="col-span-2 flex items-center">
                  <div className="h-12.5 w-15 rounded-md">
                    {isEmpty(product.image) ? (
                      false
                    ) : (
                      <Image
                        src={product.image}
                        width={60}
                        height={50}
                        alt="Product"
                      />
                    )}
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    {product.name}
                  </p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                  <p className="text-sm text-black dark:text-white">
                    {product.status}
                  </p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    RM{product.price}
                  </p>
                </div>
                <div className="col-span-1 flex items-center">
                  <Link
                    href={`/product/${product.id}`}
                    className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-2 text-center font-medium text-primary hover:bg-opacity-90"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProductPage;
