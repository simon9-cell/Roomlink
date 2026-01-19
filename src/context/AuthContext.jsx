// import { createContext, useContext, useState } from "react";
// import { supabase } from "../supabaseClient";
// import { useEffect } from "react";

// const AuthContext = createContext()

//  const AuthProvider = ({children}) => {
//  const [session, setSession] = useState(undefined)

//  // sign up function

//  const signUpNewUser = async (email, password)=> {
//   const {error, data} = await supabase.auth.signUp({
//    email: email,
//    password: password,
//   })

//   if(error) {
//    console.log("Error Ocurred while Singning Up", error.messsage);
//    return {success: false, error}
//   }
//   return {success: true, data}
//  }

//  // sign in function

//  const signInUser = async (email, password) => {
   
//   const {error, data} = await supabase.auth.signInWithPassword({
//    email: email,
//    password: password
//   });

//   if(error) {
//    console.log("Error Occurred while Login In", error.message);
//    return {success: false, error };
//   }
//   return {success: true, data};
//  };

//  const signOut = async ()=> {
//   const {error} = await supabase.auth.signOut()

//   if (error){
//    console.log("Error occurred Signing Out", error.message)
//   };
//  }

//  useEffect(()=> {
//   // 1. geting the session
//    supabase.auth.getSession().then(({data: {session}}) => {
//     setSession(session)
//    });

//    // 2. Set up the Listener and capture the subscription correctly
//    const {data: {subscription}} =  supabase.auth.onAuthStateChange((_event, session) => {
//     setSession(session)
//    })

//    // 3. CleanUp function

//    return ()=> {
//     subscription.unsubscribe()
//    }

//  }, [])


//  return (
//   <AuthContext.Provider value={{session, signUpNewUser, signOut, signInUser}}>
//     {children}  
//   </AuthContext.Provider>
//  )
// }

// export default AuthProvider


// export const useAuth = ()=>{
//  return useContext(AuthContext);
// };


import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Helper: Fetch Name from Profiles Table ---
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.log("Error fetching profile:", error.message);
    }
  };

  // --- Sign Up: Auth + Profile Insert ---
  const signUpNewUser = async (email, password, name) => {
    // 1. Create the Auth User
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { success: false, error };

    // 2. Insert the Name into your new Profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: data.user.id, full_name: name }]);

      if (profileError) return { success: false, error: profileError };
    }

    return { success: true, data };
  };

  // --- Sign In ---
  const signInUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { success: false, error };
    return { success: true, data };
  };

  // --- Sign Out ---
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
        console.log(session.user.id)
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ session, userProfile, signUpNewUser, signInUser, signOut, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;