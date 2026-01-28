import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";

const RoomPage = () => {
  const [location, setLocation] = useState("all");
  const [gender, setGender] = useState("all");
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); 
  const [sort, setSort] = useState("newest");
  const [hasFetched, setHasFetched] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const [locOpen, setLocOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  const locRef = useRef(null);
  const sortRef = useRef(null);
  const genderRef = useRef(null);

  useEffect(() => {
    document.title = "Find Roommates & Bedspaces | RoomLink";
  }, []);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setRooms([])
    
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      let query = supabase.from("roommates").select("*", { count: "exact" });

      if (location !== "all") {
        query = query.ilike("location", `%${location}%`);
      }

      if (gender !== "all") {
        query = query.eq("gender_pref", gender);
      }

      if (activeSearch.trim()) {
        const term = `%${activeSearch.trim()}%`;
        query = query.or(`name.ilike.${term},location.ilike.${term}`);
      }

      const sortConfigs = {
        newest: { col: "created_at", asc: false },
        price_low: { col: "price", asc: true },
        price_high: { col: "price", asc: false },
      };
      const s = sortConfigs[sort] || sortConfigs.newest;

      query = query
        .order(s.col, { ascending: s.asc })
        .order("id", { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;
      console.log(data)
      if (error) throw error;

      setRooms(data || []);
      setTotalCount(count || 0);
      setHasFetched(true);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [location, gender, sort, activeSearch, currentPage]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    setCurrentPage(1);
  }, [location, activeSearch, sort, gender]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locRef.current && !locRef.current.contains(event.target)) setLocOpen(false);
      if (sortRef.current && !sortRef.current.contains(event.target)) setSortOpen(false);
      if (genderRef.current && !genderRef.current.contains(event.target)) setGenderOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setLocation("all");
    setGender("all");
    setSearch("");
    setActiveSearch("");
    setSort("newest");
    setCurrentPage(1);
  };

  const ChevronIcon = ({ isOpen }) => (
    <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1L5 5L9 1" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <section className="bg-slate-200 max-md:mb-10 dark:text-white dark:bg-gray-900 min-h-screen font-sans overflow-x-hidden pt-6">
      <div className="bg-slate-200 dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700 px-4 py-6 shadow-sm sticky top-16 z-30 ">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActiveSearch(search);
            }}
            className="flex items-center bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl px-2 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
          >
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent p-2 text-sm outline-none text-slate-800 dark:text-white font-bold min-w-0 placeholder:text-slate-400 dark:placeholder:text-gray-400"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md">
              Search
            </button>
          </form>

          <div className="grid grid-cols-3 gap-2 w-full">
            <div className="relative" ref={genderRef}>
              <button
                onClick={() => { setGenderOpen(!genderOpen); setLocOpen(false); setSortOpen(false); }}
                className={`w-full flex flex-col items-start border rounded-2xl px-3 py-2 bg-white dark:bg-gray-800 dark:text-white transition-all ${genderOpen ? "border-blue-500 ring-2 ring-blue-500/30" : "border-slate-200 dark:border-gray-700"}`}
              >
                <span className="text-[8px] text-blue-600 font-black uppercase">Gender</span>
                <span className="text-[11px] text-black dark:text-white font-bold truncate w-full pr-6 text-left">{gender === "all" ? "Any" : gender}</span>
                <ChevronIcon isOpen={genderOpen} />
              </button>
              {genderOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-xl z-40 overflow-hidden py-1">
                  {["all", "Male", "Female"].map((g) => (
                    <li key={g} onClick={() => { setGender(g); setGenderOpen(false); }} className={`px-4 py-3 text-xs font-bold capitalize cursor-pointer transition-colors ${gender === g ? "bg-blue-600 text-white" : "text-slate-600 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700"}`}>
                      {g === "all" ? "Anyone" : g}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative" ref={locRef}>
              <button
                onClick={() => { setLocOpen(!locOpen); setGenderOpen(false); setSortOpen(false); }}
                className={`w-full flex flex-col items-start border rounded-2xl px-3 py-2 bg-white dark:bg-gray-800 dark:text-white transition-all ${locOpen ? "border-blue-500 ring-2 ring-blue-500/30" : "border-slate-200 dark:border-gray-700"}`}
              >
                <span className="text-[8px] text-blue-600 font-black uppercase">Location</span>
                <span className="text-[11px] font-bold text-black dark:text-white truncate w-full pr-6 text-left capitalize">{location}</span>
                <ChevronIcon isOpen={locOpen} />
              </button>
              {locOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-xl z-40 overflow-hidden py-1">
                  {["all", "oleh", "ozoro", "abraka"].map((loc) => (
                    <li key={loc} onClick={() => { setLocation(loc); setLocOpen(false); }} className={`px-4 py-3 text-xs font-bold capitalize cursor-pointer transition-colors ${location === loc ? "bg-blue-600 text-white" : "text-slate-600 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700"}`}>
                      {loc}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative" ref={sortRef}>
              <button
                onClick={() => { setSortOpen(!sortOpen); setGenderOpen(false); setLocOpen(false); }}
                className={`w-full flex flex-col items-start border rounded-2xl px-3 py-2 bg-white dark:bg-gray-800 dark:text-white transition-all ${sortOpen ? "border-blue-500 ring-2 ring-blue-500/30" : "border-slate-200 dark:border-gray-700"}`}
              >
                <span className="text-[8px] text-blue-600 font-black uppercase">Sort By</span>
                <span className="text-[11px] font-bold text-black dark:text-white truncate w-full pr-6 text-left">{sort === "newest" ? "Newest" : sort === "price_low" ? "Low Price" : "High Price"}</span>
                <ChevronIcon isOpen={sortOpen} />
              </button>
              {sortOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-xl z-40 overflow-hidden py-1">
                  {[{ l: "Newest", v: "newest" }, { l: "Low Price", v: "price_low" }, { l: "High Price", v: "price_high" }].map((s) => (
                    <li key={s.v} onClick={() => { setSort(s.v); setSortOpen(false); }} className={`px-4 py-3 text-xs font-bold cursor-pointer transition-colors ${sort === s.v ? "bg-blue-600 text-white" : "text-slate-600 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700"}`}>
                      {s.l}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 mt-12 pb-24">
        <div className="flex flex-wrap justify-center gap-8">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="w-full max-w-sm bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 animate-pulse">
                <div className="w-full h-64 bg-slate-200 rounded-[2rem] mb-4"></div>
              </div>
            ))
          ) : rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.id} className="w-full max-w-sm hover:-translate-y-2 transition-transform duration-300">
                <Card room={room} linkpath={`/rooms/${room.id}`} />
              </div>
            ))
          ) : !loading && hasFetched ? (
            /* CRITICAL FIX: Only show this if NOT loading */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="text-xl font-black dark:text-white text-slate-800 uppercase tracking-tight mb-2">No matches found</h3>
              <p className="text-slate-500 dark:text-white text-sm max-w-xs mb-8">Try adjusting your filters or clearing your search.</p>
              <button onClick={handleReset} className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg ">
                Clear all filters
              </button>
            </div>
          ) : null}
        </div>

        {!loading && totalCount > 0 && (
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
              Page <span className="text-blue-600">{currentPage}</span> of {totalPages}
            </div>
            <div className="flex items-center gap-4">
              <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-8 py-4 bg-white dark:bg-gray-800 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-white disabled:opacity-30 active:scale-95 transition-all">
                Previous
              </button>
              <button disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-10 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest disabled:opacity-30 active:scale-95 transition-all">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomPage;