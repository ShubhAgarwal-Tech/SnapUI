import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isGenerator = pathname === "/app";

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <nav
      className="
      sticky top-0 z-50
      backdrop-blur-md
      bg-[#0b0b0f]/95
      border-b border-[#1f2937]
    "
    >
      <div className="flex items-center justify-between px-6 md:px-20 py-5">
        {/* LOGO */}
        <Link
          to="/"
          onClick={scrollTop}
          className="group flex items-center gap-3 select-none"
        >
          <div
            className="
            w-10 h-10 rounded-xl
            bg-gradient-to-br from-blue-400 to-blue-600
            flex items-center justify-center
            text-white font-extrabold text-xl
            shadow-md
            transition-transform group-hover:scale-105
          "
          >
            S
          </div>

          <h1 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Snap
            </span>
            UI
          </h1>
        </Link>

        {/* ACTION BUTTON */}
        <div>
          {isHome && (
            <Link
              to="/app"
              onClick={scrollTop}
              className="
                bg-gradient-to-r from-blue-400 to-blue-600
                px-5 py-2 rounded-lg
                text-white font-medium
                transition hover:opacity-90 hover:scale-[1.03]
              "
            >
              Get Started
            </Link>
          )}

          {isGenerator && (
            <Link
              to="/"
              onClick={scrollTop}
              className="
                bg-gradient-to-r from-blue-400 to-blue-600
                px-5 py-2 rounded-lg
                text-white font-medium
                transition hover:opacity-90 hover:scale-[1.03]
              "
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
