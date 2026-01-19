import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlineChatAlt2,
  HiOutlineLocationMarker,
  HiOutlineCash,
  HiOutlineShieldCheck,
  HiOutlineUserGroup, 
} from "react-icons/hi";

const RoomateDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");

  useEffect(() => {
    const fetchRoomDetail = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("roommates")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setRoom(data);

        if (data.image_url) {
          const images = Array.isArray(data.image_url) ? data.image_url : [data.image_url];
          setActiveImg(images[0]);
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetail();
  }, [id]);

  if (loading)
    return (
      <div className="pt-32 text-center animate-pulse font-bold text-slate-400">
        Loading details...
      </div>
    );
  if (!room)
    return (
      <div className="pt-32 text-center font-bold text-red-500">
        Listing not found!
      </div>
    );

  const images = Array.isArray(room.image_url) ? room.image_url : [room.image_url];

  const generateLink = () => {
    const rawNum = room.phone_number ? String(room.phone_number).replace(/\D/g, "") : "";
    if (rawNum.length < 10) return null;
    let finalNum = rawNum.startsWith("0") ? "234" + rawNum.substring(1) : rawNum.startsWith("234") ? rawNum : "234" + rawNum;

    const message =
      `👋 *Roommate Inquiry: ${room.name}*\n\n` +
      `📍 *Location:* ${room.location}\n` +
      `👤 *Preference:* ${room.gender_pref || 'Any'}\n` +
      `💰 *Budget:* ₦${Number(room.price).toLocaleString()}\n` +
      `🔗 *Link:* ${window.location.href}\n\n` +
      `Hi, I'm interested in this roommate listing. Is it still available?`;

    return `https://api.whatsapp.com/send?phone=${finalNum}&text=${encodeURIComponent(message)}`;
  };

  const whatsappUrl = generateLink();

  // Helper for dynamic gender styling
  const genderColor = room.gender_pref === 'Male' ? 'text-blue-600' : room.gender_pref === 'Female' ? 'text-pink-500' : 'text-slate-600';

  return (
    <div className="max-w-6xl mx-auto pt-24 pb-20 px-6 bg-slate-50 min-h-screen overflow-hidden mb-5">
      <Link
        to="/rooms"
        className="text-blue-600 mb-6 inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:-translate-x-1 transition-transform"
      >
        ← Back to Roommates
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT SIDE: IMAGES */}
        <div className="w-full lg:w-3/5">
          <div className="relative">
            <img
              src={activeImg}
              alt={room.name}
              className="w-full h-[320px] md:h-[500px] object-cover rounded-[2.5rem] shadow-2xl border-[6px] md:border-[12px] border-white transition-all duration-500"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-6 overflow-x-auto pb-4 scrollbar-hide px-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImg(img)}
                  className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-4 transition-all ${
                    activeImg === img ? "border-blue-600 scale-105" : "border-white"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: INFO & CONTACT */}
        <div className="w-full lg:w-2/5 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1.5 text-red-600 font-black text-[10px] uppercase tracking-wider">
                <HiOutlineLocationMarker />
                <span>{room.location}</span>
              </div>
              
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              
              {/* UPDATED GENDER PREFERENCE DISPLAY */}
              <div className={`flex items-center gap-1.5 font-black text-[10px] uppercase tracking-wider ${genderColor}`}>
                <HiOutlineUserGroup />
                <span>{room.gender_pref ? `${room.gender_pref} Roommate Needed` : 'Any Gender Needed'}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              {room.name}
            </h1>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400">Budget Contribution</p>
              <p className="text-3xl font-black text-slate-900">
                ₦{Number(room.price).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
              <HiOutlineCash size={32} />
            </div>
          </div>

          <div className="bg-slate-100/50 p-6 rounded-3xl">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-3 ">Description</h3>
            <p className="text-slate-600 leading-relaxed font-bold">
              {room.description || "No description provided for this roommate listing."}
            </p>
          </div>

          {/* SAFETY DISCLAIMER */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3">
            <HiOutlineShieldCheck className="text-amber-600 shrink-0" size={20} />
            <p className="text-[12px] text-amber-800 font-medium leading-tight">
              <strong className="block uppercase text-[10px] tracking-widest mb-1">Safety Note:</strong>
              Meet potential roommates in public places first. Verify credentials before making any payments.
            </p>
          </div>

          {/* CONTACT SECTION */}
          <div className="mt-auto">
            {room.phone_number ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${room.phone_number}`}
                  className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 hover:text-gray-300 transition-all"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 01-7.143-7.143c-.155-.441.011-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Call Now
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: "#25D366" }}
                    className="flex-[1.5] flex items-center justify-center gap-3 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-green-100 hover:brightness-110 active:scale-95 transition-all"
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

export default RoomateDetail;