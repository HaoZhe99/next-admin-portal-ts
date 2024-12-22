"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const { get, isEmpty } = require("lodash");

interface Product {
  name: string;
  price: string;
  status: string;
  image: string;
}

interface ProductEditProps {
  params: {
    slug: string;
  };
}

const EditProduct = ({ params }: ProductEditProps) => {
  const { slug } = params;
  const router = useRouter();

  const [nameValue, setNameValue] = useState<string>("");
  const [priceValue, setPriceValue] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("");
  const [imageValue, setImageValue] = useState<string>("");

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const fetchProductDetail = async () => {
    try {
      const res = await fetch(`/api/product/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const product: Product = await res.json();

        const productName = get(product, ["name"], "");
        const productPrice = get(product, ["price"], "");
        const productStatus = get(product, ["status"], "");
        const productImage = get(product, ["image"], "");

        setNameValue(productName);
        setPriceValue(productPrice);
        setStatusValue(productStatus);
        setImageValue(productImage);
      } else {
        const error = await res.json();
        alert(error.message || "Something went wrong!");
      }
    } catch (error) {
      alert("An error occurred while fetching the product.");
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const onClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const status = formData.get("status") as string;
    const image = formData.get("image");

    try {
      const res = await fetch("/api/product", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: slug,
          name,
          price,
          status,
          image: isEmpty(image) ? imageValue : image,
        }),
      });

      if (res.ok) {
        alert("Product updated successfully!");
        router.push("/product");
      } else {
        const error = await res.json();
        alert(error.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  const onClickDelete = async (id: string) => {
    try {
      const res = await fetch("/api/product?id=" + id, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/product");
        alert("Product deleted successfully!");
      } else {
        const error = await res.json();
        alert(error.message || "Something went wrong!");
      }
    } catch (error) {
      alert("An error occurred while deleting the product.");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Product" />

      <div className="grid grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Product Form
              </h3>
            </div>
            <form action="#" onSubmit={onClickSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter product name"
                    value={nameValue} // Bind to state
                    onChange={(e) => setNameValue(e.target.value)} // Update state on change
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Price <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="Enter product price"
                    value={priceValue} // Bind to state
                    onChange={(e) => setPriceValue(e.target.value)} // Update state on change
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Status
                  </label>

                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="status"
                      value={statusValue} // Bind to state
                      onChange={(e) => setStatusValue(e.target.value)} // Update state on change
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select your status
                      </option>
                      <option
                        value="1"
                        className="text-body dark:text-bodydark"
                      >
                        Active
                      </option>
                      <option
                        value="0"
                        className="text-body dark:text-bodydark"
                      >
                        Inactive
                      </option>
                    </select>

                    <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        toBase64(file).then((base64) => {
                          setImageValue(base64);
                        });
                      }
                    }}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  />
                  {isEmpty(imageValue) ? (
                    false
                  ) : (
                    <Image
                      src={imageValue}
                      alt="Selected"
                      width={0}
                      height={0}
                      className="h-20 w-24"
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex justify-center rounded bg-primary p-3 px-4 font-medium text-gray hover:bg-opacity-90"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => onClickDelete(slug)}
                    className="flex justify-center rounded bg-danger p-3 px-4 font-medium text-gray hover:bg-opacity-90"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditProduct;
