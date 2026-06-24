import {
  createContext,
  useState,
  useEffect,
} from "react";

export const ThemeContext =
  createContext();

function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] =
    useState(() => {
      const savedTheme =
        localStorage.getItem("theme");

      return savedTheme === "dark";
    });

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;