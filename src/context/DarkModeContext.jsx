import { createContext, useContext, useEffect, useState } from "react";

// Create context
const DarkModeContext = createContext();

// Provider component
 const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // On initial load, read saved mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);
  }, []);

  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode); // save preference
      document.documentElement.classList.toggle("dark", newMode); // update html class
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use dark mode context
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

export default DarkModeProvider;

