import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import Card from "../components/Card";

const RoomPage = () => {
  const [location, setLocation] = useState("all");
  const [gender, setGender] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const [locOpen, setLocOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  const locRef = useRef(null);
  const sortRef = useRef(null);
  const genderRef = useRef(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      let query = supabase.from("roommates").select("*", { count: "exact" }).range(from, to);
      if (location !== "all") query = query.eq("location", location);
      if (gender !== "all") query = query.eq("gender_pref", gender);
      if (search.trim()) query = query.ilike("name", `%${search.trim()}%`);

      const sortConfigs = {
        newest: { col: "created_at", asc: false },
        price_low: { col: "price", asc: true },
        price_high: { col: "price", asc: false },
      };
      const s = sortConfigs[sort] || sortConfigs.newest;
      query = query.order(s.col, { ascending: s.asc });

      const { data, error, count } = await query;
      if (error) throw error;
      setRooms(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, [location, gender, sort, search, currentPage]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);
  useEffect(() => { setCurrentPage(1); }, [location, search, sort, gender]);

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

  const ChevronIcon = ({ isOpen }) => (
    <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5 5L9 1" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <section className="bg-slate-50 min-h-screen font-sans overflow-x-hidden pt-6">

      {/* FILTER HEADER */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-6 shadow-sm sticky top-16 z-30">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <form
            onSubmit={(e) => { e.preventDefault(); fetchRooms(); }}
            className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl px-2 py-1.5 focus-within:bg-white focus-within:ring-4 ring-blue-50 transition-all"
          >
            <input
              type="text"
              placeholder="Search by location or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none p-2 text-sm outline-none text-slate-800 font-bold min-w-0"
            />
            <button type="submit" className="bg-blue-600 text-white px-5 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md">
              Search
            </button>
          </form>

          <div className="grid grid-cols-3 gap-2 w-full">
            <div className="relative" ref={genderRef}>
              <button onClick={() => { setGenderOpen(!genderOpen); setLocOpen(false); setSortOpen(false); }} className={`w-full flex flex-col items-start border rounded-2xl px-3 py-2 bg-white relative transition-all ${genderOpen ? "border-blue-500 ring-4 ring-blue-50" : "border-slate-200"}`}>
                <span className="text-[8px] text-blue-600 font-black uppercase tracking-tighter">Gender</span>
                <span className="text-[11px] font-bold text-slate-800 capitalize truncate w-full pr-6 text-left">{gender === "all" ? "Any" : gender}</span>
                <ChevronIcon isOpen={genderOpen} />
              </button>
              {genderOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 overflow-hidden py-1">
                  {["all", "Male", "Female"].map((g) => (
                    <li key={g} onClick={() => { setGender(g); setGenderOpen(false); }} className={`px-4 py-3 text-xs font-bold capitalize cursor-pointer transition-colors ${gender === g ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>{g === "all" ? "Anyone" : g}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative" ref={locRef}>
              <button onClick={() => { setLocOpen(!locOpen); setSortOpen(false); setGenderOpen(false); }} className={`w-full flex flex-col items-start border rounded-2xl px-3 py-2 bg-white relative transition-all ${locOpen ? "border-blue-500 ring-4 ring-blue-50" : "border-slate-200"}`}>
                <span className="text-[8px] text-blue-600 font-black uppercase tracking-tighter">Location</span>
                <span className="text-[11px] font-bold text-slate-800 capitalize truncate w-full pr-6 text-left">{location}</span>
                <ChevronIcon isOpen={locOpen} />
              </button>
              {locOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 overflow-hidden py-1">
                  {["all", "oleh", "ozoro", "abraka"].map((loc) => (
                    <li key={loc} onClick={() => { setLocation(loc); setLocOpen(false); }} className={`px-4 py-3 text-xs font-bold capitalize cursor-pointer transition-colors ${location === loc ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>{loc}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative" ref={sortRef}>
              <button onClick={() => { setSortOpen(!sortOpen); setLocOpen(false); setGenderOpen(false); }} className={`w-full flex flex-col items-start border rounded-2xl px-3 py-2 bg-white relative transition-all ${sortOpen ? "border-blue-500 ring-4 ring-blue-50" : "border-slate-200"}`}>
                <span className="text-[8px] text-blue-600 font-black uppercase tracking-tighter">Sort By</span>
                <span className="text-[11px] font-bold text-slate-800 truncate w-full pr-6 text-left">{sort === "newest" ? "Newest" : sort === "price_low" ? "Budget" : "Luxury"}</span>
                <ChevronIcon isOpen={sortOpen} />
              </button>
              {sortOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 overflow-hidden py-1">
                  {[{ l: "Newest", v: "newest" }, { l: "Budget", v: "price_low" }, { l: "Luxury", v: "price_high" }].map((s) => (
                    <li key={s.v} onClick={() => { setSort(s.v); setSortOpen(false); }} className={`px-4 py-3 text-xs font-bold cursor-pointer transition-colors ${sort === s.v ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>{s.l}</li>
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
            /* Loading Skeleton */
            [...Array(4)].map((_, i) => (
              <div key={i} className="w-full max-w-sm bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 animate-pulse">
                <div className="w-full h-64 bg-slate-200 rounded-[2rem] mb-4"></div>
              </div>
            ))
          ) : rooms.length > 0 ? (
            /* Card List */
            rooms.map((room) => (
              <div
                
                key={room.id}
                className="w-full max-w-sm hover:-translate-y-2 transition-transform duration-300"
              >
                <Card room={room} linkpath={`/rooms/${room.id}`}  />
              </div>
            ))
          ) : (
            /* No Results Feedback */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">No matches found</h3>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-8">
                We couldn't find any roommates matching your current filters. Try adjusting your search.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setLocation("all");
                  setGender("all");
                }}
                className="bg-white border-2 border-slate-200 text-slate-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && totalCount > 0 && (
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
              Page <span className="text-blue-600">{currentPage}</span> of {totalPages}
            </div>
            <div className="flex items-center gap-4">
              <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-30 active:scale-95 transition-all shadow-sm">
                Previous
              </button>
              <button disabled={currentPage >= totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 disabled:opacity-30 active:scale-95 transition-all">
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