import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(true);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await ensureProfile(currentSession.user);
        }
      } catch (err) {
        console.error("Auth Init Error:", err.message);
      } finally {
        setLoading(false); // 🔑 This ensures the app renders even if there's an error
      }
    };

    init();

    // Set up the listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === "SIGNED_IN" && currentSession?.user) {
        await ensureProfile(currentSession.user);
      }

      if (event === "SIGNED_OUT") {
        setProfileName("");
      }
    });

    // 🛠️ Fixed the syntax error here
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // 🔐 ENSURE PROFILE EXISTS
  const ensureProfile = async (user) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "User";

        await supabase.from("profiles").insert({
          id: user.id,
          full_name: name,
          email: user.email,
        });

        setProfileName(name);
      } else {
        setProfileName(profile.full_name);
      }
    } catch (err) {
      console.error("Profile sync error:", err.message);
    }
  };

  // ---------- AUTH ACTIONS ----------

  const signUpNewUser = async (email, password, name) => {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
  };

  const signInUser = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
  };

 const signOutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfileName("");
  };

  const value = {
    user,
    session,
    userName: profileName || "User",
    loading,
    signUpNewUser,
    signInUser,
    signInWithGoogle,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;