import React from "react";
import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0b0f] flex flex-col items-center justify-center text-white px-6 text-center">

      {/* BRAND */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 
          flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
          S
        </div>

        <h1 className="text-3xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Snap
          </span>
          UI
        </h1>
      </div>

      {/* ERROR CODE */}
      <h2 className="text-8xl font-extrabold text-blue-500 mb-4 tracking-wider">
        404
      </h2>

      {/* MESSAGE */}
      <p className="text-xl font-semibold mb-3">
        Page Not Found
      </p>

      <p className="text-gray-400 max-w-lg leading-relaxed mb-10">
        The page you’re trying to reach doesn’t exist or may have been moved.
        Don’t worry — you can easily return to the SnapUI homepage and continue building beautiful UI components.
      </p>

      {/* ACTION */}
      <Link
        to="/"
        className="bg-gradient-to-r from-blue-400 to-blue-600 
        px-12 py-4 rounded-xl text-white font-semibold text-lg
        transition-all duration-300
        hover:opacity-90 hover:scale-[1.05]"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NoPage;
