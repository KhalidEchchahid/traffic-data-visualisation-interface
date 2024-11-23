import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-gradient-to-r from-blue-300 to-blue-600 text-white py-3 px-6 shadow-md flex justify-around items-center">
      <div className="text-lg font-semibold">🎉عرض خاص</div>
      <div className="flex items-center space-x-4">
        <Link
          href="https://wa.me/212629063441"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold underline hover:no-underline transition"
        >
          0629063441
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
