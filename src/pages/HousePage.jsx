import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";

const HousePage = () => {
  const [location, setLocation] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const [locOpen, setLocOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const locRef = useRef(null);
  const sortRef = useRef(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      let query = supabase
        .from("houses")
        .select("*", { count: "exact", head: false });

      // Location filter
      if (location !== "all") {
        query = query.eq("location", location);
      }

      // Search filter
      if (search.trim()) {
        query = query.or(
          `name.ilike.%${search.trim()}%,location.ilike.%${search.trim()}%`
        );
      }

      // Sorting
      const sortConfigs = {
        newest: { col: "created_at", asc: false },
        price_low: { col: "price", asc: true },
        price_high: { col: "price", asc: false },
      };

      const s = sortConfigs[sort] || sortConfigs.newest;
      query = query.order(s.col, { ascending: s.asc });

      // Pagination MUST be last
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setRooms(data || []);
      setTotalCount(count ?? 0);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [location, sort, search, currentPage]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    setCurrentPage(1);
  }, [location, search, sort]);

   const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locRef.current && !locRef.current.contains(event.target))
        setLocOpen(false);
      if (sortRef.current && !sortRef.current.contains(event.target))
        setSortOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <section className="bg-slate-50 min-h-screen font-sans overflow-x-hidden pt-6">

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
                )
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">
                No houses found
              </h3>
            </div>
          )}
        </div>

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

export default HousePage;