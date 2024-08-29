"use client";

interface OrderSummaryProps {
  title: string;
  price: number;
  discount: number;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

const OrderSummary = ({
  title,
  price,
  discount,
  selectedColor,
  selectedSize,
  quantity,
}: OrderSummaryProps) => {
  const totalPrice = price * quantity;
  const hasDiscount = discount > price;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">ملخص الطلب</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-semibold">المنتج:</p>
          <p className="text-gray-900">{title}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-semibold">اللون:</p>
          <p className="text-gray-900">{selectedColor}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-semibold">الحجم:</p>
          <p className="text-gray-900">{selectedSize}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-semibold">الكمية:</p>
          <p className="text-gray-900">{quantity}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-semibold">ثمن التوصيل:</p>
          <p className="text-gray-900">30 درهم</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-700 font-semibold">السعر لكل وحدة:</p>
          <div className="text-right">
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                {discount} درهم
              </p>
            )}
            <p className="text-lg font-bold text-gray-900">{price} درهم</p>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-gray-900">المجموع:</p>
            <p className="text-xl font-bold text-gray-900">{totalPrice + 30} درهم</p>
          </div>
        </div>
        <a
          href="#order"
          className="mt-6 w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-red-500 rounded-lg hover:opacity-90 transition-opacity text-center block"
        >
          إتمام الطلب
        </a>
      </div>
    </div>
  );
};

export default OrderSummary;
