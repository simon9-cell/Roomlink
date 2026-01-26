import React from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "../components/Accordions";
import Navbar from "../components/Navbar";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 dark:text-white text-slate-800">
      {/* ---------------- NAVBAR ---------------- */}
      <Navbar />

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="bg-gradient-to-br from-[#1877F2] to-[#4da0f0] text-white py-20 px-6 text-center rounded-b-3xl mt-16 relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          Find Your Next Home or Roommate With{" "}
          <span className="italic uppercase tracking-tight">RoomLink</span>
        </h1>
        <p className="max-w-xl mx-auto text-lg opacity-90 mb-6">
          RoomLink connects people with houses and roommates — fast, simple, and
          stress-free.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/house")}
            className="bg-white text-[#1877F2] font-bold px-6 py-3 rounded-xl hover:brightness-105 hover:scale-105 transition-transform duration-200"
          >
            Browse Houses
          </button>
          <button
            onClick={() => navigate("/rooms")}
            className="bg-white text-[#1877F2] font-bold px-6 py-3 rounded-xl hover:brightness-105 hover:scale-105 transition-transform duration-200"
          >
            Find Roommates
          </button>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="max-w-6xl mx-auto px-5 my-20 text-center">
        <h2 className="text-2xl font-bold mb-10">How RoomLink Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-2">Browse Listings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Explore houses or roommates by price and type.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-2">Contact Agents/Roommates</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Message directly and schedule visits or meetings.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-2">Move In / Share Space</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Secure your house or roommate agreement and start living
              comfortably.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ACCORDION ---------------- */}
      <section className="max-w-3xl mx-auto px-5 my-16">
        <h2 className="text-2xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          <Accordion title="Is RoomLink free to use?">
            Yes. Browsing houses and contacting agents or roommates is
            completely free.
          </Accordion>
          <Accordion title="Who can post listings?">
            Anyone can post a house listing or look for roommates — no
            verification is required.
          </Accordion>
          <Accordion title="Can I list my own house or find roommates?">
            Yes. After signing up, you can post your own house or search for
            roommates.
          </Accordion>
          <Accordion title="Is my data secure?">
            Yes. RoomLink uses encrypted authentication and secure storage to
            keep your data safe.
          </Accordion>
        </div>
      </section>

      {/* ---------------- CALL TO ACTION ---------------- */}
      <section className="bg-[#1877F2] text-white py-16 text-center mt-20 mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Find Your Next House or Roommate?
        </h2>
        <p className="opacity-90 mb-6 max-w-xl mx-auto">
          Find your next house or roommate quickly and easily with RoomLink.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-[#1877F2] px-8 py-3 font-bold rounded-xl hover:brightness-105 hover:scale-105 transition-transform duration-200"
        >
          Create Free Account
        </button>
      </section>

      {/* ---------------- SMALL CONTACT BUTTON ---------------- */}
      <a
        href="https://wa.me/2348142917397"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="Contact me on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7"
        >
          <path d="M20.52 3.48A11.88 11.88 0 0012 0C5.37 0 .01 5.37.01 12c0 2.12.55 4.1 1.6 5.86L0 24l6.3-1.62A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 22a10 10 0 01-5.26-1.5l-.38-.23-3.74.96.99-3.64-.24-.37A10 10 0 1122 12c0 5.52-4.48 10-10 10zm5.36-7.64l-1.44-.67a.5.5 0 00-.53.09l-.7.68a8.1 8.1 0 01-3.72-3.72l.68-.7a.5.5 0 00.09-.53l-.67-1.44a.5.5 0 00-.5-.27 5.64 5.64 0 00-1.68.55 4.63 4.63 0 00-2.23 2.33 5.64 5.64 0 00.55 1.68.5.5 0 00.27.5l1.44.67a.5.5 0 00.53-.09l.7-.68a8.1 8.1 0 013.72 3.72l-.68.7a.5.5 0 00-.09.53l.67 1.44a.5.5 0 00.5.27 5.64 5.64 0 001.68-.55 4.63 4.63 0 002.23-2.33 5.64 5.64 0 00-.55-1.68.5.5 0 00-.27-.5z" />
        </svg>
      </a>
    </div>
  );
};

export default Homepage;
