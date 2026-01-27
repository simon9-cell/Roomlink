import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, session, signOutUser, userName, loadingSession } = useAuth();
  const navigate = useNavigate();

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
  const pendingDeleteId = useRef(null);

  // ==========================
  // Fetch user's listings
  // ==========================
  const fetchMyListings = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const { data: houseData, error: houseError } = await supabase
        .from("houses")
        .select("*")
        .eq("user_id", session.user.id);

      if (houseError) throw houseError;

      const { data: roommateData, error: roommateError } = await supabase
        .from("roommates")
        .select("*")
        .eq("user_id", session.user.id);

      if (roommateError) throw roommateError;

      const combined = [
        ...(houseData || []).map((h) => ({ ...h, type: "houses" })),
        ...(roommateData || []).map((r) => ({ ...r, type: "roommates" })),
      ];

      setMyListings(
        combined.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        ),
      );
    } catch (error) {
      console.error("Fetch error:", error.message);
      toast.error("Failed to load listings");
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user) fetchMyListings();
  }, [session, fetchMyListings]);

  // ==========================
  // Form handlers
  // ==========================
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
    setView(item.type === "houses" ? "house" : "roommate");

    setFormData({
      title: item.name,
      price: item.price,
      location: item.location,
      phone: item.phone_number,
      description: item.description,
      category: item.type === "houses" ? "house" : "roommate",
      gender_pref: item.gender_pref || "Any",
    });
  };

  // ==========================
  // Delete listing
  // ==========================
  const handleDelete = (id, table) => {
    if (pendingDeleteId.current === id) {
      deleteItem(id, table);
      pendingDeleteId.current = null;
      return;
    }

    pendingDeleteId.current = id;
    toast.info("Tap delete again to confirm", { autoClose: 3000 });
  };

  const deleteItem = async (id, table) => {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      toast.success("Listing deleted successfully");
      fetchMyListings();
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to delete listing");
    }
  };

  // ==========================
  // Form submission
  // ==========================
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

          const {
            data: { publicUrl },
          } = supabase.storage.from("product_images").getPublicUrl(fileName);

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
      if (formData.category === "roommate")
        submissionData.gender_pref = formData.gender_pref;

      const targetTable =
        formData.category === "house" ? "houses" : "roommates";

      if (editingId) {
        const { error } = await supabase
          .from(targetTable)
          .update(submissionData)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Listing updated successfully");
      } else {
        if (files.length === 0)
          throw new Error("Please upload at least one photo");
        const { error } = await supabase
          .from(targetTable)
          .insert([submissionData]);
        if (error) throw error;
        toast.success("Listing published successfully");
      }

      resetForm();
      fetchMyListings();
    } catch (error) {
      console.error(error.message);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Sign Out
  // ==========================
  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to sign out");
    }
  };

  // ==========================
  // Render
  // =======================;

  return (
    <div className="min-h-screen dark:text-white dark:bg-gray-900 bg-slate-200 text-slate-900 p-4 sm:p-6 md:p-8 font-sans pt-24 pb-20">
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-blue-600 tracking-tight uppercase italic">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-300 text-sm font-medium">
            Welcome back, <span className="font-bold">{userName}</span>
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="bg-slate-100 dark:bg-gray-700 dark:text-white text-slate-600 border border-slate-200 dark:border-gray-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-700 dark:hover:text-white transition-all"
        >
          Sign Out
        </button>
      </div>

      {/* CONDITIONAL VIEWS */}
      {view === "menu" ? (
        <>
          {/* LISTINGS */}
          {myListings.length > 0 && (
            <div className="mb-20">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-400">
                <span className="w-8 h-[2px] bg-blue-600"></span>
                My Active Ads ({myListings.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  >
                    {item.image_url?.[0] && (
                      <img
                        src={item.image_url[0]}
                        className="w-full h-48 object-cover"
                        alt=""
                      />
                    )}

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-slate-900 dark:text-white text-sm truncate">
                          {item.name}
                        </h3>
                        <span className="text-[9px] bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 px-2 py-1 rounded-lg font-black uppercase">
                          {item.type === "houses" ? "House" : "Room"}
                        </span>
                      </div>

                      <p className="text-blue-600 dark:text-blue-400 font-black text-xl">
                        ₦{Number(item.price).toLocaleString()}
                      </p>

                      <div className="flex gap-2 mt-5">
                        <button
                          onClick={() => startEdit(item)}
                          className="flex-1 bg-slate-50 dark:bg-gray-700 border border-slate-100 dark:border-gray-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              item.id,
                              item.type === "houses" ? "houses" : "roommates",
                            )
                          }
                          className="flex-1 bg-red-50 dark:bg-red-700 text-red-600 dark:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-800 hover:text-white transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div
              onClick={() => {
                setView("house");
                setFormData({ ...formData, category: "house" });
              }}
              className="bg-white dark:bg-gray-800   border-2 border-white/10 p-10 rounded-3xl cursor-pointer hover:border-[#1877F2] transition-all flex flex-col items-center group"
            >
              <div className="w-16 h-16 bg-[#1877F2]/10 rounded-full flex items-center justify-center text-3xl mb-4">
                🏠
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Post a House
              </h2>
              <p className="text-gray-400 text-sm mt-2 text-center">
                Rent out apartments, flats, or shops.
              </p>
            </div>

            <div
              onClick={() => {
                setView("roommate");
                setFormData({ ...formData, category: "roommate" });
              }}
              className="bg-white dark:bg-gray-800  border-2 border-white/10 p-10 rounded-3xl cursor-pointer hover:border-[#1877F2] transition-all flex flex-col items-center group"
            >
              <div className="w-16 h-16   bg-[#1877F2]/10 rounded-full flex items-center justify-center text-3xl mb-4">
                🤝
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Find a Roommate
              </h2>
              <p className="text-gray-400 text-sm mt-2 text-center">
                Post bedspaces or shared rooms.
              </p>
            </div>
          </div>
        </>
      ) : (
        // FORM VIEW
        <div className="max-w-xl mx-auto pb-20">
          <button onClick={resetForm} className="mb-6 text-[#1877F2] font-bold">
            ← Back to Menu
          </button>

          <form
            onSubmit={handleSubmit}
            className="bg-[#1c1f23] p-6 sm:p-8 rounded-3xl border border-white/10 space-y-5 shadow-2xl"
          >
            <h2 className="text-2xl font-black text-white">
              {editingId ? "Update Listing" : "Create Listing"}
            </h2>

            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Title e.g Bedsitter"
              className="w-full bg-[#0b0e11] p-4 rounded-xl border border-white/5 text-white outline-none focus:border-[#1877F2]"
              required
            />
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Price"
              className="w-full bg-[#0b0e11] p-4 rounded-xl border border-white/5 text-white outline-none focus:border-[#1877F2]"
              required
            />
            <input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Location e.g oleh"
              className="w-full bg-[#0b0e11] p-4 rounded-xl border border-white/5 text-white outline-none focus:border-[#1877F2]"
              required
            />
            <input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="WhatsApp Number"
              className="w-full bg-[#0b0e11] p-4 rounded-xl border border-white/5 text-white outline-none focus:border-[#1877F2]"
              required
            />
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description "
              className="w-full bg-[#0b0e11] p-4 rounded-xl h-28 border border-white/5 text-white outline-none focus:border-[#1877F2]"
              required
            />
            {/* Gender Preference - only for roommates */}
            {formData.category === "roommate" && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="gender_pref"
                  className="text-sm font-medium text-gray-400 ml-1"
                >
                  Gender Preference
                </label>
                <select
                  value={formData.gender_pref}
                  onChange={(e) =>
                    setFormData({ ...formData, gender_pref: e.target.value })
                  }
                  className="w-full bg-[#0b0e11] p-4 rounded-xl border border-white/5 text-white outline-none focus:border-[#1877F2]"
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            )}

            <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl text-center relative hover:bg-white/5 transition-all">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <p className="text-xs font-bold text-gray-400">Upload Photos</p>
              {files.length > 0 && (
                <p className="mt-2 text-[#1877F2] text-xs font-bold">
                  {files.length} images selected
                </p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#1877F2] text-white font-black py-5 rounded-xl hover:brightness-110 transition-all uppercase tracking-widest text-xs shadow-xl shadow-blue-500/10"
            >
              {loading
                ? "Publishing..."
                : editingId
                  ? "Update Listing"
                  : "Publish Ad"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
