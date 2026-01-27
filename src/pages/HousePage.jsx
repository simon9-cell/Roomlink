import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";

const HousePage = () => {
  const [location, setLocation] = useState("all");
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Browse Houses | RoomLink";
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const [locOpen, setLocOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const locRef = useRef(null);
  const sortRef = useRef(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);

    // Calculate pagination range
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      // 1. Initialize the query
      let query = supabase.from("houses").select("*", { count: "exact" });

      // 2. Location Filter (Case-insensitive)
      if (location !== "all") {
        // Use ilike to ensure "oleh" matches "Oleh" or "OLEH"
        query = query.ilike("location", location);
      }

      // 3. Smart Search Filter
      if (activeSearch.trim()) {
        const term = `%${activeSearch.trim()}%`;

        if (location !== "all") {
          // If location is already picked, only search the NAME
          // This prevents searching 'Oleh' in name and 'Oleh' in location from clashing
          query = query.ilike("name", term);
        } else {
          // If no location is picked, search both name and location
          query = query.or(`name.ilike.${term},location.ilike.${term}`);
        }
      }

      // 4. Sorting Logic
      const sortConfigs = {
        newest: { col: "created_at", asc: false },
        price_low: { col: "price", asc: true },
        price_high: { col: "price", asc: false },
      };

      const s = sortConfigs[sort] || sortConfigs.newest;
      query = query
        .order(s.col, { ascending: s.asc })
        .order("id", { ascending: false });

      // 5. Pagination Range
      query = query.range(from, to);

      // 6. Execute Request
      const { data, error, count } = await query;

      if (error) throw error;

      setRooms(data || []);
      setTotalCount(count ?? 0);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [location, sort, activeSearch, currentPage]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    setCurrentPage(1);
  }, [location, activeSearch, sort]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locRef.current && !locRef.current.contains(event.target))
        setLocOpen(false);
      if (sortRef.current && !sortRef.current.contains(event.target))
        setSortOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setSearch("");
    setActiveSearch("");
    setLocation("all");
    setSort("newest");
    setCurrentPage(1);
  };

  const ChevronIcon = ({ isOpen }) => (
    <div
      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="dark:stroke-white  stroke-slate-600 "
      >
        <path
          d="M1 1L5 5L9 1"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  return (
    <section className="bg-slate-200 max-md:mb-10 dark:text-white dark:bg-gray-900 min-h-screen font-sans overflow-x-hidden pt-6">
      {/* FILTER HEADER */}
      <div className="bg-slate-200 dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 px-4 py-6 shadow-sm sticky top-16 z-30 ">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActiveSearch(search);
              setCurrentPage(1);
            }}
            className="flex items-center bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-2xl px-2 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
          >
            <input
              type="text"
              placeholder="Search by location or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none p-2 text-sm outline-none text-slate-800 dark:text-gray-100 font-bold min-w-0"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white dark:text-white px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md"
            >
              Search
            </button>
          </form>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {/* Location Dropdown */}
            <div className="relative" ref={locRef}>
              <button
                onClick={() => {
                  setLocOpen(!locOpen);
                  setSortOpen(false);
                }}
                className={`w-full flex flex-col items-start border rounded-2xl px-3 py-2 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 relative transition-all ${
                  locOpen
                    ? "border-blue-500 dark:border-blue-400 shadow-md dark:shadow-black/50"
                    : "border-slate-200 dark:border-gray-600"
                }`}
              >
                <span className="text-[8px] text-blue-600 font-black uppercase tracking-tighter">
                  Location
                </span>
                <span className="text-[11px] font-bold truncate w-full pr-6 text-left">
                  {location}
                </span>
                <ChevronIcon isOpen={locOpen} />
              </button>
              {locOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-2xl shadow-2xl dark:shadow-black/50 z-40 overflow-hidden py-1">
                  {["all", "oleh", "ozoro", "abraka"].map((loc) => (
                    <li
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setLocOpen(false);
                      }}
                      className={`px-4 py-3 text-xs font-bold capitalize cursor-pointer transition-colors ${
                        location === loc
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-gray-100 hover:bg-slate-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      {loc}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setLocOpen(false);
                }}
                className={`w-full flex flex-col items-start border rounded-2xl px-3 py-2 bg-white dark:bg-gray-700 text-slate-800 dark:text-gray-100 relative transition-all ${
                  sortOpen
                    ? "border-blue-500 dark:border-blue-400 shadow-md dark:shadow-black/50"
                    : "border-slate-200 dark:border-gray-600"
                }`}
              >
                <span className="text-[8px] text-blue-600 font-black uppercase tracking-tighter">
                  Sort By
                </span>
                <span className="text-[11px] font-bold truncate w-full pr-6 text-left">
                  {sort === "newest"
                    ? "Newest"
                    : sort === "price_low"
                      ? "Low Price"
                      : "High Price"}
                </span>
                <ChevronIcon isOpen={sortOpen} />
              </button>
              {sortOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-2xl shadow-2xl dark:shadow-black/50 z-40 overflow-hidden py-1">
                  {[
                    { l: "Newest", v: "newest" },
                    { l: "Low Price", v: "price_low" },
                    { l: "High Price", v: "price_high" },
                  ].map((s) => (
                    <li
                      key={s.v}
                      onClick={() => {
                        setSort(s.v);
                        setSortOpen(false);
                      }}
                      className={`px-4 py-3 text-xs font-bold cursor-pointer transition-colors ${
                        sort === s.v
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-gray-100 hover:bg-slate-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      {s.l}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto p-6 mt-12 pb-24">
        <div className="flex flex-wrap justify-center gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-full max-w-sm bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 animate-pulse"
              >
                <div className="w-full h-64 bg-slate-200 rounded-[2rem] mb-4"></div>
              </div>
            ))
          ) : rooms.length > 0 ? (
            rooms.map(
              (room) =>
                room && (
                  <div
                    key={room.id}
                    className="w-full max-w-sm hover:-translate-y-2 transition-transform duration-300"
                  >
                    <Card room={room} linkpath={`/house/${room.id}`} />
                  </div>
                ),
            )
          ) : (
            // Replace your "No houses found" div with this:
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full">
              <div className="bg-slate-200/50 p-6 rounded-full mb-6">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl dark:text-white font-black text-slate-800 uppercase tracking-tight mb-2">
                No houses found
              </h3>
              <p className="text-slate-500 dark:text-white text-sm mb-8 max-w-xs">
                We couldn't find anything matching "{activeSearch || location}".
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={handleReset}
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg  active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {!loading && totalCount > 0 && (
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-400">
              Page{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {currentPage}
              </span>{" "}
              of {totalPages}
            </div>
            <div className="flex items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-8 py-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-white disabled:opacity-30 active:scale-95 transition-all"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-10 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-30 active:scale-95 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HousePage;
