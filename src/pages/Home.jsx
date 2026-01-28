import React, { useState, useEffect } from "react";
import { BsStars } from "react-icons/bs";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Home = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  const scrollToFeatures = () => {
    document.getElementById("features").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden
        transition-opacity duration-500 ease-out
        ${loaded ? "opacity-100" : "opacity-0"}
        bg-[#0b0b0f] text-white`}
    >
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 md:px-20 mt-24">
        <span className="flex items-center gap-2 text-blue-400 font-medium mb-5">
          <BsStars /> AI Powered UI Generation
        </span>

        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-5xl">
          Design & Generate Modern UI <br className="hidden md:block" />
          Components Instantly
        </h2>

        <p className="mt-6 max-w-3xl text-lg text-gray-400">
          SnapUI transforms your ideas into clean, responsive, and
          production-ready UI components using AI. Choose your preferred
          framework and get instant code with live preview.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-5">
          <Link
            to="/app"
            className="bg-gradient-to-r from-blue-400 to-blue-600
              px-12 py-4 rounded-xl text-white font-semibold text-lg
              transition-transform hover:scale-105"
          >
            Start Building
          </Link>

          <button
            onClick={scrollToFeatures}
            className="px-12 py-4 rounded-xl
              border border-[#1f2937]
              bg-[#0f0f0f]
              transition hover:bg-[#1a1a22]"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mt-36 px-6 md:px-20 text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-14">Why Developers use it?</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Feature
            icon="⚡"
            title="Instant UI Creation"
            desc="Generate beautiful UI components in seconds using AI prompts."
          />

          <Feature
            icon="🎨"
            title="Modern & Responsive"
            desc="Clean layouts optimized for all screen sizes."
          />

          <Feature
            icon="🧩"
            title="Multiple Frameworks"
            desc="Supports HTML, Tailwind CSS, Bootstrap and more."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-36 text-center px-6">
        <h3 className="text-3xl md:text-4xl font-bold">
          Start Creating with SnapUI Today
        </h3>

        <p className="mt-4 text-gray-400">
          Experience AI-powered UI development.
        </p>

        <Link
          to="/app"
          className="inline-block mt-10 bg-gradient-to-r from-blue-400 to-blue-600
            px-14 py-4 rounded-xl text-white font-semibold text-lg
            transition hover:opacity-90 hover:scale-[1.03]"
        >
          Try It Free
        </Link>
      </section>

      <Footer />
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div
    className="p-10 rounded-2xl
      bg-[#141319]
      border border-[#1f2937]
      transition-all hover:shadow-xl hover:-translate-y-2"
  >
    <div className="text-4xl mb-4 text-blue-400">{icon}</div>

    <h3 className="text-xl font-semibold mb-2">{title}</h3>

    <p className="text-gray-400">{desc}</p>
  </div>
);

export default Home;
