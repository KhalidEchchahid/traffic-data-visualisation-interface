"use client";
import CheckoutForm from "@/components/CheckoutForm";
import Gallery from "@/components/Gallery";
import Navbar from "@/components/Navbar";
import ProductInfo from "@/components/ProductInfo";
import { useState } from "react";

const product = {
  id: 1,
  name: "🔥 سروال القندريسي العصري 🔥",
  price: 180,
  discount: 230,
  images: [
    "/images/kandrissi-noir1.jpeg",
    "/images/kandrissi-noir2.jpeg",
    "/images/kandrissi-noir3.jpeg",
    "/images/kandrisi-bleu1.jpeg",
    "/images/kandrissi-bleu2.jpeg",
  ],
  colors: ["أسود", "أزرق"],
  sizes: ["M", "L", "XL", "2XL"],
  category: "سراويل",
  availableStock: 50,
  sku: "KANDRISSI-J001",
};

const Page = () => {
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-start gap-8">
          <Gallery images={product.images} />
          <ProductInfo
            title={product.name}
            sizes={product.sizes}
            colors={product.colors}
            price={product.price}
            discount={product.discount}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>
        <CheckoutForm
          price={product.price}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          quantity={quantity}
        />
      </div>
    </div>
  );
};

export default Page;

