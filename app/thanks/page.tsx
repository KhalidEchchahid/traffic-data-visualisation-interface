import Link from "next/link";

const Page = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center  bg-gray-50 text-black">
      <div className="max-w-lg text-center">
        <h1 className="text-[1.725rem] font-extrabold tracking-tight text-black">
          شكراً لطلبك!
        </h1>
        <p className="mt-4 text-[1.125rem] text-gray-700">
          تم استلام طلبك بنجاح. نحن الآن نقوم بمعالجة طلبك وسيتم إبلاغك بتحديثات
          الطلب قريبًا.
        </p>
      </div>

      <Link
        href="/"
        className="inline-block mt-4 px-10 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition-transform transform hover:-translate-y-1 hover:scale-105"
      >
        العودة إلى الصفحة الرئيسية
      </Link>

      <div className="mt-24 text-center">
        <p className="text-gray-500 text-sm">
          إذا كانت لديك أي استفسارات، لا تتردد في{" "}
          <Link
            href="https://wa.me/600353017"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline hover:text-gray-800"
          >
            التواصل معنا
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Page;
