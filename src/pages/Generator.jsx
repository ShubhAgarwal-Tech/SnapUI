import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCopy } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { ImNewTab } from "react-icons/im";
import { LuRefreshCw, LuEye } from "react-icons/lu";
import { RiCodeFill } from "react-icons/ri";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const options = [
  { value: "html-css", label: "HTML + CSS" },
  { value: "html-tailwind", label: "HTML + Tailwind CSS" },
  { value: "html-bootstrap", label: "HTML + Bootstrap" },
  { value: "html-css-js", label: "HTML + CSS + JS" },
  { value: "html-bootstrap-tailwind", label: "HTML + Bootstrap + Tailwind" },
];

const extractCode = (res) => {
  const match = res.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return match ? match[1].trim() : res.trim();
};

const Generator = () => {
  const iframeRef = useRef(null);

  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [outputScreen, setOutputScreen] = useState(false);
  const [apiError, setApiError] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  // ---------------- API HANDLER ----------------

  const getResponse = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your component");
      return;
    }

    if (!framework) {
      toast.error("Please select a framework");
      return;
    }

    if (prompt.length > 1000) {
      toast.error("Prompt is too long (max 1000 characters)");
      return;
    }

    setLoading(true);
    setApiError("");
    setOutputScreen(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 sec

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. Now, Generate a modern, responsive UI component.

Component description: ${prompt}
Framework: ${framework.value}

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
        `,
        signal: controller.signal,
      });

      if (!response?.text) throw new Error("Empty response");

      const finalCode = extractCode(response.text);

      setCode(finalCode);
      setOutputScreen(true);
      setTab(1);
    } catch (err) {
      console.error(err);

      if (err.name === "AbortError") {
        setApiError("Request timed out. Please try again.");
      } else if (
        err.message?.includes("429") ||
        err.status === "RESOURCE_EXHAUSTED"
      ) {
        setApiError("Daily SnapUI limit is reached. Please try again later.");
      } else if (err.message?.includes("503")) {
        setApiError("Server is busy right now. Please try again later.");
      } else {
        setApiError("Failed to generate UI. Please try again.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // ---------------- ACTIONS ----------------

  const copyCode = async () => {
    if (!code) return toast.error("No code to copy");
    await navigator.clipboard.writeText(code);
    toast.success("Copied successfully");
  };

  const downloadFile = () => {
    if (!code) return toast.error("No code to download");

    const blob = new Blob([code], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "SnapUI-Code.html";
    link.click();

    URL.revokeObjectURL(url);
  };

  const openInNewTab = () => {
    if (!code) return;

    const fixedCode = code.replace(
      "</head>",
      `<style>body{overflow:auto !important;}</style></head>`,
    );

    const newTab = window.open();
    newTab.document.write(fixedCode);
    newTab.document.close();
  };

  const refreshPreview = () => {
    if (iframeRef.current) {
      setPreviewLoading(true);
      iframeRef.current.srcdoc = iframeRef.current.srcdoc;
    }
  };

  // ---------------- STYLES ----------------

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#0f0f0f",
      borderColor: state.isFocused ? "#60a5fa" : "#1f2937",
      borderRadius: 14,
      padding: "6px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(96,165,250,0.25)" : "none",
      transition: "all 0.25s ease",
      cursor: "pointer",

      ":active": {
        borderColor: "#60a5fa", // avoid white flash
      },

      "&:hover": {
        borderColor: "#777",
      },
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "#121212",
      borderRadius: 14,
      border: "1px solid #1f2937",
      padding: 6,
      marginTop: 8,
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#222" : "transparent",
      color: "#fff",
      borderRadius: 10,
      padding: 12,
      cursor: "pointer",
      transition: "background 0.2s ease",

      ":active": {
        backgroundColor: "#222", // force dark (no flash)
      },
    }),

    singleValue: (base) => ({
      ...base,
      color: "#fff",
      fontWeight: 500,
    }),

    input: (base) => ({
      ...base,
      color: "#fff",
    }),

    indicatorSeparator: () => ({ display: "none" }),
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-24 py-20">
        {/* LEFT PANEL */}
        <div className="lg:w-1/2 w-full bg-[#141319] rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-6 sp-text">
            UI Component Generator
          </h2>

          <p className="font-semibold mb-2">Framework</p>

          <Select
            options={options}
            value={framework}
            onChange={setFramework}
            styles={customStyles}
          />

          <p className="font-semibold mt-6 mb-2">Describe Component</p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your component in detail..."
            className="w-full min-h-[220px] rounded-2xl bg-[#0f0f0f] mt-2 p-4
              text-white placeholder:text-gray-500
              border border-[#1f2937]
              transition-all duration-300 ease-out
              hover:border-[#777]
              focus:border-blue-400
              focus:ring-4 focus:ring-blue-400/25
              focus:outline-none"
          />

          {apiError && <p className="text-red-400 mt-3 text-sm">{apiError}</p>}

          <button
            disabled={loading}
            onClick={getResponse}
            className="mt-4 ml-auto flex items-center gap-2 bg-gradient-to-r
              from-blue-400 to-blue-600 px-6 py-3 rounded-lg
              hover:opacity-80 transition disabled:opacity-60"
          >
            {loading ? (
              <>
                Generating
                <ClipLoader size={16} color="#fff" />
              </>
            ) : (
              <>
                Generate <BsStars />
              </>
            )}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-1/2 w-full bg-[#141319] rounded-xl overflow-hidden min-h-[70vh]">
          {!outputScreen ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center text-gray-400">
              <HiOutlineCode size={60} />
              <p className="mt-3">Your output will appear here...</p>
            </div>
          ) : (
            <>
              {/* TABS */}
              <div className="flex gap-3 p-4">
                <TabButton active={tab === 1} onClick={() => setTab(1)}>
                  <RiCodeFill className="text-lg" />
                  <span>Code</span>
                </TabButton>

                <TabButton
                  active={tab === 2}
                  onClick={() => {
                    setPreviewLoading(true);
                    setTab(2);
                  }}
                >
                  <LuEye className="text-lg" />
                  <span>Preview</span>
                </TabButton>
              </div>

              {/* ACTION BAR */}
              <div className="flex justify-between px-4 pb-3">
                <p className="font-semibold">
                  {tab === 1 ? "Code Editor" : "Live Preview"}
                </p>

                <div className="flex gap-2">
                  {tab === 1 ? (
                    <>
                      <ActionBtn onClick={copyCode}>
                        <IoCopy />
                      </ActionBtn>
                      <ActionBtn onClick={downloadFile}>
                        <BiExport />
                      </ActionBtn>
                    </>
                  ) : (
                    <>
                      <ActionBtn onClick={openInNewTab}>
                        <ImNewTab />
                      </ActionBtn>
                      <ActionBtn onClick={refreshPreview}>
                        <LuRefreshCw />
                      </ActionBtn>
                    </>
                  )}
                </div>
              </div>

              {/* CONTENT */}
              <div className="h-[60vh] overflow-y-auto relative scroll-smooth">
                {tab === 1 ? (
                  <Editor
                    theme="vs-dark"
                    language="html"
                    value={code}
                    height="100%"
                  />
                ) : (
                  <div className="relative w-full h-full bg-[#0b0b0f]">
                    {previewLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <ClipLoader size={40} color="#60a5fa" />
                      </div>
                    )}
                    <iframe
                      ref={iframeRef}
                      srcDoc={`
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: auto !important;
        min-height: 100%;
        overflow: auto !important;
      }
    </style>
    ${code}
  `}
                      title="Preview"
                      sandbox="allow-scripts"
                      onLoad={() => setPreviewLoading(false)}
                      className={`w-full h-full border-none transition-opacity duration-300 ${
                        previewLoading ? "opacity-0" : "opacity-100"
                      }`}
                      style={{ backgroundColor: "#0b0b0f" }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

// ---------------- SMALL COMPONENTS ----------------

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 w-1/2 py-2 rounded-xl
      border transition-all duration-300 ease-out
      ${
        active
          ? "bg-gradient-to-r from-blue-400 to-blue-600 border-transparent shadow-md"
          : "bg-[#0f0f0f] border-[#1f2937] hover:border-[#777]"
      }`}
  >
    {children}
  </button>
);

const ActionBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-[35px] h-[35px] rounded-xl bg-[#0f0f0f] border border-[#1f2937]
      flex items-center justify-center transition-all duration-200
      hover:border-[#777] hover:bg-[#333]"
  >
    {children}
  </button>
);

export default Generator;
