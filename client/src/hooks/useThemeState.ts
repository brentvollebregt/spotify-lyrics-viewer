import green from "@material-ui/core/colors/green";
import { createMuiTheme } from "@material-ui/core/styles";
import { useEffect, useMemo, useState } from "react";

const localStorageKey = "dark-theme";

const useThemeState = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  // Pull current state out of local storage
  useEffect(() => {
    const rawState = localStorage.getItem(localStorageKey);
    setDarkMode(rawState !== null);
  }, []);

  // Save to local storage while toggling
  const toggleTheme = () =>
    setDarkMode(m => {
      const newState = !m;

      if (newState) {
        localStorage.setItem(localStorageKey, "enabled");
      } else {
        localStorage.removeItem(localStorageKey);
      }

      return newState;
    });

  return { theme, toggleTheme, darkModeEnabled: darkMode };
};

const getTheme = (isDark: boolean) => {
  if (isDark) {
    return createMuiTheme({
      palette: {
        type: "dark",
        primary: {
          main: green[500]
        }
      }
    });
  } else {
    return createMuiTheme({
      palette: {
        type: "light",
        primary: {
          main: green[800]
        }
      }
    });
  }
};

export default useThemeState;
