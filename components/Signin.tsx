"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const Signin = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (res?.error) {
        setError("كلمة المرور غير صحيحة");
        return;
      }

      router.push("/admin");
    } catch (error) {
      setError("حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <form
        className="p-8 w-full max-w-md flex flex-col justify-center items-center gap-4
                   border border-solid border-gray-700 bg-gray-800 rounded-xl shadow-2xl"
        onSubmit={handleSubmit}
        dir="rtl"
      >
        <h1 className="w-full text-3xl font-bold text-center text-white mb-6">
          تسجيل الدخول
        </h1>

        {error && (
          <div className="flex items-center justify-center gap-2 text-white bg-red-600 p-3 rounded-lg w-full">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="w-full">
          <label className="text-sm text-gray-300 mb-2 block">
            البريد الإلكتروني
          </label>
          <div className="flex items-center border border-gray-600 rounded-lg shadow-sm overflow-hidden bg-gray-700">
            <input
              type="email"
              placeholder="أدخل البريد الإلكتروني"
              className="w-full p-3 text-gray-200 bg-transparent focus:outline-none rounded-lg"
              name="email"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="w-full">
          <label className="text-sm text-gray-300 mb-2 block">
            كلمة المرور
          </label>
          <div className="flex items-center border border-gray-600 rounded-lg shadow-sm overflow-hidden bg-gray-700">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="أدخل كلمة المرور"
              className="w-full p-3 text-gray-200 bg-transparent focus:outline-none rounded-l-lg"
              name="password"
              required
            />
            <button
              className="p-3 bg-transparent hover:bg-gray-600"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
              type="button"
            >
              {showPassword ? (
                <EyeOff size={20} color="#A1A1A1" />
              ) : (
                <Eye size={20} color="#A1A1A1" />
              )}
            </button>
          </div>
        </div>

        <button
          className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg transition hover:from-blue-600 hover:to-indigo-700"
          type="submit"
          disabled={loading}
        >
          {loading ? "جاري التحميل..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
};

export default Signin;
