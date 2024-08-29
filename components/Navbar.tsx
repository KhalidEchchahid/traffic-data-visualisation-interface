import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 shadow-md flex justify-around items-center">
      <div className="text-lg font-semibold">
        🎉عرض خاص
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="https://wa.me/645557609"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold underline hover:no-underline transition"
        >
          0645557609
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
