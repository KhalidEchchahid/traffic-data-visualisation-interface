"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createOrder } from "@/lib/actions/order.action";

const formSchema = z.object({
  fullname: z
    .string()
    .min(2, "الاسم الكامل مطلوب")
    .max(50, "الاسم الكامل يجب ألا يتجاوز 50 حرفًا"),
  phone: z
    .string()
    .min(10, "رقم الهاتف مطلوب")
    .max(13, "رقم الهاتف يجب أن يكون بين 10 و13 رقمًا"),
  city: z.string().min(1, "المدينة مطلوبة"),
  shippingAdress: z.string().min(1, "عنوان الشحن مطلوب"),
});

interface Props {
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  price: number;
}
const CheckoutForm = ({
  selectedColor,
  selectedSize,
  quantity,
  price,
}: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const totalAmount = price * quantity;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      phone: "",
      city: "",
      shippingAdress: "",
    },
  });

  const total = 100;
  const totalRounded = parseFloat(total.toFixed(2));

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (selectedColor === "" || selectedSize === "") {
        setError("يرجى اختيار الحجم قبل متابعة الطلب.");
        setIsSubmitting(false);
        return;
      }
      const newOrder = await createOrder({
        name: values.fullname,
        shippingAdress: values.shippingAdress,
        city: values.city,
        phone: values.phone,
        totalAmount,
        color: selectedColor,
        size: selectedSize,
        quantity,
      });

      router.push("/thanks");
    } catch (error) {
      console.log("[checkout_post]", error);
      setError("حدث خطأ ما ، يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div className="flex items-start justify-center mb-10 px-4" id="order">
      <div className="w-full max-w-lg pt-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          تفاصيل الشحن
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="الاسم الكامل"
                      {...field}
                      onKeyDown={handleKeyPress}
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-md shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="رقم الهاتف"
                      {...field}
                      onKeyDown={handleKeyPress}
                      inputMode="numeric"
                      pattern="(?:\+212|0)[5-7][0-9]{8}"
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-md shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدينة</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="المدينة"
                      {...field}
                      onKeyDown={handleKeyPress}
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-md shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingAdress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الشحن</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="عنوان الشحن"
                      {...field}
                      onKeyDown={handleKeyPress}
                      className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-md shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 w-full rounded-lg hover:opacity-90 transition duration-300"
              disabled={isSubmitting}
            >
              متابعة الطلب
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutForm;
