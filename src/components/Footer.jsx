import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="
        mt-20
        border-t border-[#1f2937]
        px-6 lg:px-24 py-12
        bg-[#0b0b0f]
        text-white
      "
    >
      <div className="flex flex-col items-center text-center gap-6">
        {/* BRAND (CLICKABLE) */}
        <Link
          to="/"
          onClick={scrollToTop}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div
            className="
              w-9 h-9 rounded-xl
              bg-gradient-to-br from-blue-400 to-blue-600
              flex items-center justify-center 
              text-white font-extrabold text-lg
              shadow-md
              transition-transform duration-300
              group-hover:scale-105
            "
          >
            S
          </div>

          <h4 className="text-xl font-bold tracking-wide">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Snap
            </span>
            UI
          </h4>
        </Link>

        {/* DESCRIPTION */}
        <p className="text-gray-400 max-w-md leading-relaxed">
          AI powered UI component generator for modern developers. Generate
          clean, responsive and production-ready UI instantly.
        </p>

        {/* COPYRIGHT */}
        <p className="text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} SnapUI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
