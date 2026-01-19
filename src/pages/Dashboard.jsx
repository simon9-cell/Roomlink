import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const Dashboard = () => {
  const { userProfile, session, signOut } = useAuth();

  // State Management
  const [view, setView] = useState("menu");
  const [loading, setLoading] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    phone: "",
    description: "",
    category: "",
    gender_pref: "Any",
  });
  const [files, setFiles] = useState([]);

  const fetchMyListings = async () => {
    if (!session?.user?.id) return;
    try {
      const { data: houseData } = await supabase
        .from("houses")
        .select("*")
        .eq("user_id", session.user.id);
      const { data: roommateData } = await supabase
        .from("roommates")
        .select("*")
        .eq("user_id", session.user.id);

      const combined = [
        ...(houseData || []).map((h) => ({ ...h, type: "houses" })),
        ...(roommateData || []).map((r) => ({ ...r, type: "roommates" })),
      ];
      setMyListings(
        combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
    } catch (error) {
      console.error("Error fetching listings:", error.message);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [session]);

  const resetForm = () => {
    setFiles([]);
    setView("menu");
    setEditingId(null);
    setFormData({
      title: "",
      price: "",
      location: "",
      phone: "",
      description: "",
      category: "",
      gender_pref: "Any",
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.name,
      price: item.price,
      location: item.location,
      phone: item.phone_number,
      description: item.description,
      category: item.type === "houses" ? "house" : "roommate",
      gender_pref: item.gender_pref || "Any",
    });
    setView(item.type === "houses" ? "house" : "roommate");
  };

  const handleDelete = async (id, table) => {
    if (window.confirm("Delete this listing permanently?")) {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) alert(error.message);
      else fetchMyListings();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrls = [];
      if (files.length > 0) {
        for (const file of files) {
          const fileName = `${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("product_images")
            .upload(fileName, file);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from("product_images").getPublicUrl(fileName);
          imageUrls.push(publicUrl);
        }
      }

      const submissionData = {
        name: formData.title,
        price: formData.price,
        location: formData.location,
        phone_number: formData.phone,
        description: formData.description,
        user_id: session.user.id,
      };

      if (imageUrls.length > 0) submissionData.image_url = imageUrls;
      const targetTable = formData.category === "house" ? "houses" : "roommates";
      
      // Add gender preference ONLY for roommates
      if (formData.category === "roommate") {
        submissionData.gender_pref = formData.gender_pref;
      }

      if (editingId) {
        await supabase.from(targetTable).update(submissionData).eq("id", editingId);
      } else {
        if (files.length === 0) throw new Error("Please upload at least one photo.");
        await supabase.from(targetTable).insert([submissionData]);
      }
      alert("Success!");
      resetForm();
      fetchMyListings();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-gray-200 p-4 sm:p-6 md:p-8 font-sans pt-20">
      <div className="max-w-[1240px] mx-auto">
        
        {/* HEADER */}
        <div className="bg-[#1c1f23] p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-[#1877F2] tracking-tight">Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Welcome back, <span className="font-bold text-white">{userProfile?.full_name || "User"}</span>
            </p>
          </div>
          <button
            onClick={signOut}
            className="bg-white/5 text-gray-300 border border-white/10 px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            Sign Out
          </button>
        </div>

        {view === "menu" ? (
          <>
            {/* ACTIVE LISTINGS */}
            {myListings.length > 0 && (
              <div className="mb-20">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                  <span className="w-1.5 h-5 bg-[#1877F2] rounded-full"></span>
                  My Active Ads
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((item) => (
                    <div key={item.id} className="bg-[#1c1f23] border border-white/10 rounded-2xl overflow-hidden hover:border-[#1877F2]/50 transition-all">
                      <img src={item.image_url?.[0]} className="w-full h-44 object-cover" alt="" />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                          <span className="text-[9px] bg-[#1877F2]/20 text-[#1877F2] px-2 py-1 rounded font-black">
                            {item.type === "houses" ? "HOUSE" : "ROOM"}
                          </span>
                        </div>
                        <p className="text-[#1877F2] font-black text-lg">₦{Number(item.price).toLocaleString()}</p>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => startEdit(item)} className="flex-1 bg-white/5 py-2 rounded-lg text-[11px] font-bold hover:bg-white/10 transition-all">Edit</button>
                          <button onClick={() => handleDelete(item.id, item.type)} className="flex-1 bg-red-500/10 text-red-400 py-2 rounded-lg text-[11px] font-bold">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div onClick={() => { setView("house"); setFormData({ ...formData, category: "house" }); }}
                className="bg-[#1c1f23] border border-white/10 p-10 rounded-3xl cursor-pointer hover:border-[#1877F2] transition-all flex flex-col items-center group">
                <div className="w-16 h-16 bg-[#1877F2]/10 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
                <h2 className="text-xl font-bold text-white">Post a House</h2>
                <p className="text-gray-400 text-sm mt-2 text-center">Rent out apartments, flats, or shops.</p>
              </div>

              <div onClick={() => { setView("roommate"); setFormData({ ...formData, category: "roommate" }); }}
                className="bg-[#1c1f23] border border-white/10 p-10 rounded-3xl cursor-pointer hover:border-[#1877F2] transition-all flex flex-col items-center group">
                <div className="w-16 h-16 bg-[#1877F2]/10 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
                <h2 className="text-xl font-bold text-white">Find a Roommate</h2>
                <p className="text-gray-400 text-sm mt-2 text-center">Post bedspaces or shared rooms.</p>
              </div>
            </div>
          </>
        ) : (
          /* SUBMISSION FORM */
          <div className="max-w-xl mx-auto pb-20">
            <button onClick={resetForm} className="mb-6 text-[#1877F2] font-bold flex items-center gap-2">
              ← Back to Menu
            </button>
            <form onSubmit={handleSubmit} className="bg-[#1c1f23] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5 shadow-2xl">
              <h2 className="text-2xl font-black text-white">{editingId ? "Update Listing" : "Create Listing"}</h2>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Title</label>
                <input type="text" value={formData.title} required placeholder="e.g. Spacious Self-Contain" className="w-full bg-[#0b0e11] p-4 rounded-xl border border-white/5 text-white outline-none focus:border-[#1877F2]" 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Price (₦)</label>
                  <input type="number" value={formData.price} required className="w-full bg-[#0b0e11] p-4 rounded-xl border border-white/5 text-white outline-none focus:border-[#1877F2]" 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Location</label>
                  <input type="text" value={formData.location} required placeholder="e.g. Ozoro" className="w-full bg-[#0b0e11] p-4 rounded-xl border border-white/5 text-white outline-none focus:border-[#1877F2]" 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase font-black ml-1">WhatsApp Number</label>
                <input type="tel" value={formData.phone} required placeholder="080XXXXXXXX" className="w-full bg-[#0b0e11] p-4 rounded-xl border border-white/5 text-white outline-none focus:border-[#1877F2]" 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>

              {/* GENDER PREFERENCE - ONLY FOR ROOMMATES */}
              {view === "roommate" && (
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Roommate Gender Preference</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Any", "Male", "Female"].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender_pref: gender })}
                        className={`py-3 rounded-xl text-[11px] font-black uppercase transition-all border ${
                          formData.gender_pref === gender
                            ? "bg-[#1877F2] border-[#1877F2] text-white shadow-lg shadow-[#1877F2]/20"
                            : "bg-[#0b0e11] border-white/5 text-gray-500 hover:border-white/20"
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase font-black ml-1">Description</label>
                <textarea value={formData.description} placeholder="Describe the space and the type of person you're looking for..." className="w-full bg-[#0b0e11] p-4 rounded-xl h-28 border border-white/5 text-white outline-none focus:border-[#1877F2]" 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl text-center relative hover:bg-white/5 transition-all">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Upload Photos</p>
                <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="absolute inset-0 opacity-0 cursor-pointer" />
                {files.length > 0 && <p className="mt-2 text-[#1877F2] text-xs font-bold">{files.length} images selected</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#1877F2] text-white font-black py-5 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest text-xs shadow-xl shadow-blue-500/10">
                {loading ? "Publishing..." : editingId ? "Update Listing" : "Publish Ad"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;