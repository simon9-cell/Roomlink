import React, { useState } from "react";
// Import the icon for the gender tag
import { HiOutlineUserGroup } from "react-icons/hi";
import { Link } from "react-router-dom";

const Card = ({ room, linkpath }) => {
  const images = Array.isArray(room.image_url)
    ? room.image_url
    : [room.image_url];
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full bg-white/45 shadow-md rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <div className="p-3 flex flex-col h-full">
        {/* IMAGE BOX / CAROUSEL WRAPPER */}
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-200 relative shrink-0 group">
          {/* 1. GENDER PREFERENCE TAG (Conditional) */}
          {room.gender_pref && (
            <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white/50 flex items-center gap-1.5">
              <HiOutlineUserGroup className="text-blue-600 text-sm" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                {room.gender_pref}
              </span>
            </div>
          )}

          {/* Images Slider */}
          <div
            className="flex transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${room.name} ${idx + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          {/* Carousel Controls */}
          {hasMultiple && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100"
              >
                <svg
                  className="w-4 h-4 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md transition-opacity opacity-0 group-hover:opacity-100"
              >
                <svg
                  className="w-4 h-4 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIndex === idx
                        ? "w-4 bg-white"
                        : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* CONTENT BOX */}
        <div className="pt-4 px-1 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.847 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                {room.location}
              </span>
            </div>
            <span className="text-base font-black text-blue-600">
              ₦{room.price?.toLocaleString()}/year
            </span>
          </div>

          <h3 className="font-bold text-gray-900 text-xl truncate uppercase italic mb-4">
            {room.name}
          </h3>

          <Link
            to={linkpath}
            className="w-full mt-auto py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-extrabold uppercase tracking-[0.15em] transition-all shadow-sm active:scale-[0.98] text-center block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
