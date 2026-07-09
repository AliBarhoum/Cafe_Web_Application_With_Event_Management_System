import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

// Define the shape of our theme context
interface ThemeContextType {
  isDark: boolean; // Current theme state
  toggleTheme: () => void; // Function to toggle between light/dark
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component that wraps the app
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Check localStorage for saved theme preference, default to light
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Toggle between dark and light modes
  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light"); // Save preference
      return newTheme;
    });
  };

  // Apply the theme class to the document body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
