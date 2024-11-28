"use client";
import { CheckCircle } from "lucide-react";

interface Props {
  title: string;
  sizes: string[];
  colors: string[];
  price: number;
  discount: number;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const ProductInfo = ({
  title,
  sizes,
  colors,
  price,
  discount,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
}: Props) => {
  const discountPercentage = discount
    ? Math.round(((discount - price) / discount) * 100)
    : 0;

  return (
    <div className="max-w-[400px] p-2 text-gray-300">
      {/* Title & Discount */}
      <div className="flex items-center justify-between gap-5">
        <h1 className="text-3xl font-bold text-yellow-500">{title}</h1>
        {discountPercentage > 0 && (
          <div className="bg-green-500 text-black text-xs font-semibold px-2 py-1 rounded-full">
            {discountPercentage}%- 
          </div>
        )}
      </div>

      {/* Price & Original Price */}
      <div className="mt-4 flex gap-4">
        <p className="text-2xl font-bold text-gray-200">{price} درهم</p>
        {discount > 0 && (
          <p className="text-sm text-gray-400 line-through mt-3">{discount} درهم</p>
        )}
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-200">الألوان:</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-lg border ${
                  selectedColor === color
                    ? "bg-yellow-500 text-black border-transparent"
                    : "bg-gray-800 text-gray-300 hover:bg-yellow-500 hover:text-black"
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-200">الأحجام:</h2>
          <div className="flex gap-2 mt-2">
            {sizes.map((size, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-lg border ${
                  selectedSize === size
                    ? "bg-yellow-500 text-black border-transparent"
                    : "bg-gray-800 text-gray-300 hover:bg-yellow-500 hover:text-black"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

     

      {/* Quantity */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-200">الكمية:</h2>
        <div className="flex items-center gap-4 mt-3">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 text-black font-bold text-xl hover:bg-yellow-600 transition-colors"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            -
          </button>
          <p className="text-2xl font-bold text-gray-200">{quantity}</p>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 text-black font-bold text-xl hover:bg-yellow-600 transition-colors"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;



//  {/* Description */}
//  <div className="mt-6 space-y-4">
//  <h2 className="text-xl font-semibold text-yellow-500">
//    🎯 كتقلب على الأناقة والراحة؟
//  </h2>
//  <p className="text-gray-300">
//    سروال القندريسي ديالنا هو الحل باش تزيد في ستايلك! مثالي لجميع
//    المناسبات بتصميم عصري ومتعدد الاستعمالات. 💎
//  </p>
//  <h3 className="text-lg font-semibold text-yellow-500">
//    🔥 علاش تختار سروال القندريسي ديالنا؟
//  </h3>
//  <ul className="space-y-2">
//    {[ 
//      "تصميم مميز وعصري",
//      "جودة عالية وخامة متينة",
//      "مناسب للإطلالات الكاجوال والأنيقة",
//      "متوفر بلونين: الأسود والأزرق باش يناسب ذوقك",
//    ].map((feature, index) => (
//      <li key={index} className="flex items-start">
//        <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 mt-1" />
//        <span>{feature}</span>
//      </li>
//    ))}
//  </ul>
//  <p className="text-yellow-500 font-semibold">
//    🚚 التوصيل مجاني في جميع أنحاء المغرب
//  </p>
//  <p className="text-green-500 font-semibold">
//    🛒 تسوق دابا واستفد من العرض!
//  </p>
//  <p className="text-gray-300">
//    📍 زورونا ولا صيفطو لينا رسالة على الواتساب للمزيد من التفاصيل!
//  </p>
//  <p className="text-yellow-500 font-semibold">
//    👉 طلبك اليوم يوصل حتى لباب دارك بسرعة!
//  </p>
// </div>