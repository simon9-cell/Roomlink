import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(initialSession);
        const currentUser = initialSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          fetchProfileName(currentUser.id);
        }
      } catch (error) {
        console.error("Auth init error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (event === 'SIGNED_IN' && currentUser) {
        fetchProfileName(currentUser.id);
      }

      if (event === 'SIGNED_OUT') {
        setProfileName("");
        localStorage.clear(); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfileName = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (data) {
        setProfileName(data.full_name);
      }
    } catch (err) {
      console.error("Error fetching profile name:", err);
    }
  };

  // --- ADDED GOOGLE SIGN IN ---
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // window.location.origin detects if you are on localhost or a deployed site
          redirectTo: window.location.origin + '/dashboard',
        },
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signUpNewUser = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } } 
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').insert([
          { id: data.user.id, full_name: name, email: email }
        ]);
        setProfileName(name);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signOutUser = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    userName: profileName || user?.user_metadata?.full_name || "User",
    loading,
    signUpNewUser,
    signInUser,
    signInWithGoogle, // ADDED TO VALUE OBJECT
    signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;