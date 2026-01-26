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

      {/* ---------------- CONTACT SECTION ---------------- */}
      <section className="bg-white dark:bg-gray-800 py-14 text-center mt-20 px-6 rounded-xl shadow-md max-w-4xl mx-auto mb-10">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Get in Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Have questions? Contact me directly!
        </p>

        {/* Small Contact Button */}
        <div className="flex justify-center mb-10" >
          <a
            href="https://wa.me/2348142917397"
            target="_blank"
            rel="noopener noreferrer"
            className="dark:bg-white bg-blue-500 text-white  dark:text-blue-500 px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition-transform"
          >
            Contact Me
          </a>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
