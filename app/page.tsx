"use client";
import CheckoutForm from "@/components/CheckoutForm";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import OrderSummary from "@/components/OrderSummary";
import ProductInfo from "@/components/ProductInfo";
import { Metadata } from "next";
import { useState } from "react";

export const metadata: Metadata = {
  title: "تألقي بأناقة وراحة مع عباءاتنا الفاخرة",
  description:
    "استكشفي تشكيلة عباياتنا المصممة بأعلى مستويات الأناقة والراحة لتناسب جميع احتياجاتك. كوني دائماً في أفضل إطلالة مع عباءاتنا الفاخرة.",
  icons: {
    icon: "/HAYAE.png",
  },
};

const product = {
  id: 1,
  name: "عباية ملكية",
  description:
    "عباية أنيقة بتصميم تقليدي يجمع بين الفخامة والبساطة، مصنوعة من أجود أنواع الأقمشة لضمان الراحة والجمال.",
  price: 450,
  discount: 500,
  colors: [
    { name: "أسود", image: "/images/abaya1.jpg" },
    { name: "أبيض", image: "/images/abaya2.jpg" },
    { name: "أزرق داكن", image: "/images/abaya3.jpg" },
    { name: "وردي فاتح", image: "/images/abaya4.jpg" },
    { name: "وردي", image: "/images/abaya5.jpg" },
  ],
  sizes: ["M", "L", "XL", "2XL"],
  category: "عبايات",
  availableStock: 25,
  sku: "ABAYA-M001",
};

const Page = () => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center gap-5 max-md:flex-col pt-5">
        <Gallery
          productMedia={product.colors}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
        <ProductInfo
          title={product.name}
          description={product.description}
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
          setMainImage={(image: string) =>
            setSelectedColor(
              product.colors.find((c) => c.image === image)?.name || ""
            )
          }
        />

        <OrderSummary
          title={product.name}
          price={product.price}
          discount={product.discount}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          quantity={quantity}
        />
      </div>
      <CheckoutForm
        price={product.price}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
      />
    </div>
  );
};

export default Page;
