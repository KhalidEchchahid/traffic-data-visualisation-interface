"use client";
import CheckoutForm from "@/components/CheckoutForm";
import Gallery from "@/components/Gallery";
import Navbar from "@/components/Navbar";
import OrderSummary from "@/components/OrderSummary";
import ProductInfo from "@/components/ProductInfo";
import { Metadata } from "next";
import { useState } from "react";

const product = {
  id: 1,
  name: "🌟 عباية أنيقة بألوان عصرية 🌟",
  description:
    "✨ استمتعي بالأناقة مع هذه العباية المميزة والمتوفرة بألوان متعددة تناسب جميع الأذواق. 🌸 مصممة لتوفر لكِ الراحة والجمال في آن واحد، مع قماش عالي الجودة يضمن لكِ مظهراً رائعاً في كل مناسبة. 🎀 الشحن متوفر بسعر 30 درهم فقط! 🚚 اطلبي الآن واختاري لونك المفضل من بين أحدث الألوان العصرية. 🌟",
  price: 450,
  discount: 500,
  colors: [
    { name: "أسود", image: "/images/abaya1.jpeg" },
    { name: "أبيض", image: "/images/abaya2.jpeg" },
    { name: "أزرق داكن", image: "/images/abaya3.jpeg" },
    { name: "وردي فاتح", image: "/images/abaya4.jpeg" },
    { name: "وردي", image: "/images/abaya5.jpeg" },
    { name: "1وردي", image: "/images/abaya6.jpeg" },
    { name: "2وردي", image: "/images/abaya7.jpeg" },
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

        {/* <OrderSummary
          title={product.name}
          price={product.price}
          discount={product.discount}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          quantity={quantity}
        /> */}
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
