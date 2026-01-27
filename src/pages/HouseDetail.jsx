import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlineChatAlt2,
  HiOutlineLocationMarker,
  HiOutlineCash,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const HouseDetail = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    console.log("Fetching house with ID:", id);
    const fetchHouseDetail = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("houses")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setHouse(data);

        // --- Dynamic Counter ---
        const viewKey = `viewed_house_${id}`;
        if (!sessionStorage.getItem(viewKey)) {
          const { error: rpcError } = await supabase.rpc(
            "increment_house_views",
            {
              target_id: id,
            },
          );
          if (!rpcError) sessionStorage.setItem(viewKey, "true");
        }
        // ----------------------

        if (data.image_url) {
          const images = Array.isArray(data.image_url)
            ? data.image_url
            : [data.image_url];
          setActiveImg(images[0]);
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHouseDetail();
    
    
  }, [id]);

  if (loading)
    return (
      <div className="pt-32 text-center animate-pulse font-bold text-slate-400">
        Loading details...
      </div>
    );
  if (!house)
    return (
      <div className="pt-32 text-center font-bold text-red-500">
        House not found!
      </div>
    );

  const images = Array.isArray(house.image_url)
    ? house.image_url
    : [house.image_url];

  const generateLink = () => {
    const rawNum = house.phone_number
      ? String(house.phone_number).replace(/\D/g, "")
      : "";
    if (rawNum.length < 10) return null;
    let finalNum = rawNum.startsWith("0")
      ? "234" + rawNum.substring(1)
      : rawNum.startsWith("234")
        ? rawNum
        : "234" + rawNum;

    const message =
      `🏠 *Property Inquiry: ${house.name}*\n\n` +
      `📍 *Location:* ${house.location}\n` +
      `💰 *Price:* ₦${Number(house.price).toLocaleString()}\n` +
      `🔗 *Link:* ${window.location.href}\n\n` +
      `Is this House still available for rent?`;

    return `https://api.whatsapp.com/send?phone=${finalNum}&text=${encodeURIComponent(
      message,
    )}`;
  };

  const whatsappUrl = generateLink();

  return (
    <div className="max-w-6xl mx-auto pt-24 pb-20 px-6 dark:text-white dark:bg-gray-900 bg-slate-50 min-h-screen overflow-hidden mb-5">
      <Link
        to="/house"
        className="text-blue-600 mb-6 inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:-translate-x-1 transition-transform"
      >
        ← Back to Listings
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT SIDE: IMAGES */}
        <div className="w-full lg:w-3/5">
          <div className="relative">
            <img
              src={activeImg}
              alt={house.name}
              className="w-full h-[320px] md:h-[500px] object-cover rounded-[2.5rem] shadow-2xl border-[6px] md:border-[12px] border-white transition-all duration-500"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-6 overflow-x-auto pb-4 scrollbar-hide px-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImg(img)}
                  className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-4 transition-all ${
                    activeImg === img
                      ? "border-blue-600 scale-105"
                      : "border-white"
                  }`}
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="thumb"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: INFO & CONTACT */}
        <div className="w-full lg:w-2/5 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase mb-2">
              <HiOutlineLocationMarker />
              <span className="capitalize">{house.location}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              {house.name}
            </h1>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400">
                Price
              </p>
              <p className="text-3xl font-black text-slate-900">
                ₦{Number(house.price).toLocaleString()}/year
              </p>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
              <HiOutlineCash size={32} />
            </div>
          </div>

          {/* --- UPDATED VIEW COUNTER UI --- */}
          <div className="flex items-center">
            <div className="flex items-center bg-slate-200/50 text-slate-500 gap-2 px-3 py-1.5 rounded-full border border-slate-100">
              <svg
                className="w-4 h-4 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-[10px] dark:text-white font-black uppercase tracking-tighter">
                {house.views || 0} Views
              </span>
            </div>
          </div>

          {/* --- UPDATED DESCRIPTION SECTION --- */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
              Description
            </h3>
            {/* Added max-height and overflow for very long text */}
            <div className="max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              <p className="text-slate-600 leading-relaxed text-sm font-medium whitespace-pre-line">
                {house.description ||
                  "The agent hasn't provided a description for this property yet."}
              </p>
            </div>
          </div>

          {/* SAFETY DISCLAIMER */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3">
            <HiOutlineShieldCheck
              className="text-amber-600 shrink-0"
              size={20}
            />
            <p className="text-[12px] text-amber-800 font-medium leading-tight">
              <strong className="block uppercase text-[10px] tracking-widest mb-1">
                Safety Note:
              </strong>
              Do not make any upfront payments for inspection or rent until you
              have physically seen the house and verified the agent.
            </p>
          </div>

          {/* UPDATED CONTACT SECTION */}
          <div className="mt-auto">
            {house.phone_number ? (
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                {/* CALL BUTTON */}
                <a
                  href={`tel:${house.phone_number}`}
                  className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-55 hover:text-gray-300 transition-all"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.143-7.143c-.155-.441.011-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  Call Agent
                </a>

                {/* WHATSAPP BUTTON */}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: "#25D366" }}
                    className="flex-[1.5] flex items-center justify-center gap-3 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all"
                  >
                    <HiOutlineChatAlt2 size={24} />
                    WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-slate-200 text-slate-500 py-6 rounded-3xl text-center font-bold uppercase text-xs border border-slate-300">
                Contact Info Unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseDetail;
