import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);

  // ======================
  // PROFILE HANDLER
  // ======================
  const ensureProfile = async (user) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const name = user.user_metadata?.full_name || "User";

        await supabase.from("profiles").upsert({
          id: user.id,
          full_name: name,
          email: user.email,
        });

        setProfileName(name);
      } else {
        setProfileName(data.full_name);
      }
    } catch (err) {
      console.error("Profile error:", err.message);
      setProfileName("User");
    }
  };

  // ======================
  // SESSION RESTORE
  // ======================
  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();

      const currentSession = data?.session ?? null;
      const currentUser = currentSession?.user ?? null;

      // CHANGE THIS: Only set state if email is confirmed
      if (currentUser && currentUser.email_confirmed_at) {
        setSession(currentSession);
        setUser(currentUser);
        ensureProfile(currentUser);
      } else {
        // If not confirmed, ensure state is clean
        setSession(null);
        setUser(null);
      }

      setLoadingSession(false);
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      const currentUser = currentSession?.user ?? null;

      // ONLY set the session/user if the email is confirmed
      if (currentUser && currentUser.email_confirmed_at) {
        setSession(currentSession);
        setUser(currentUser);

        if (event === "SIGNED_IN") {
          ensureProfile(currentUser);
        }
      } else {
        // If not confirmed, keep them logged out in the app's eyes
        setSession(null);
        setUser(null);
        setProfileName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ======================
  // AUTH METHODS
  // ======================
  const signUpNewUser = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // This ensures the link in the email takes them back to your site
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;
    return data;
  };

  const signInUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setUser(null);
    setSession(null);
    setProfileName("");
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userName: profileName || "User",
        loadingSession,
        signUpNewUser,
        signInUser,
        signOutUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
