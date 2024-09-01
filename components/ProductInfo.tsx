"use client";

interface Props {
  title: string;
  description: string;
  sizes: string[];
  colors: { name: string; image: string }[];
  price: number;
  discount: number;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  setMainImage: (image: string) => void;
}

const ProductInfo = ({
  title,
  description,
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
  setMainImage,
}: Props) => {
  const discountPercentage = discount
    ? Math.round(((discount - price) / discount) * 100)
    : 0;

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    const selectedColorObj = colors.find((c) => c.name === color);
    if (selectedColorObj) {
      setMainImage(selectedColorObj.image);
    }
  };

  return (
    <div className="max-w-[400px] p-6">
      {/* Title & Discount */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {discountPercentage > 0 && (
          <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {discountPercentage}%-
          </div>
        )}
      </div>

      {/* Price & Original Price */}
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{price} درهم</p>
        {discount > 0 && (
          <p className="text-sm text-gray-500 line-through">{discount} درهم</p>
        )}
      </div>


      {/* Colors */}
      {colors.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">الألوان:</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-lg border ${
                  selectedColor === color.name
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white border-transparent"
                    : "border-gray-300"
                }`}
                onClick={() => handleColorSelect(color.name)}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">الأحجام:</h2>
          <div className="flex gap-2 mt-2">
            {sizes.map((size, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-lg border ${
                  selectedSize === size
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white border-transparent"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
{/* Description */}
<div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-700">الوصف:</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      {/* Quantity */}
      <div className="mt-6 hidden">
        <h2 className="text-lg font-semibold text-gray-700">الكمية:</h2>
        <div className="flex items-center gap-4 mt-3">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-xl hover:opacity-90 transition-opacity"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            -
          </button>
          <p className="text-2xl font-bold text-gray-900">{quantity}</p>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold text-xl hover:opacity-90 transition-opacity"
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
