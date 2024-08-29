// components/Hero.js
import React from 'react';

const Hero = () => {
  return (
    <section className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('/abaya-background.png')" }}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"></div>
      
      <div className="container mx-auto h-full flex flex-col justify-center items-center text-center text-white relative z-10" style={{ direction: 'rtl' }}>
        <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg animate-fade-in">
          تألقي بأحدث مجموعة عبايات
        </h1>
        <p className="text-2xl mb-8 drop-shadow-md animate-fade-in delay-2">
          تجربة الأناقة والتميز مع تصاميمنا الحصرية.
        </p>
        <a href="#gallery" className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-8 rounded-lg text-lg font-medium hover:from-red-500 hover:to-pink-500 transition transform hover:scale-105">
          استكشف المجموعة الآن
        </a>
      </div>
    </section>
  );
}

export default Hero;
