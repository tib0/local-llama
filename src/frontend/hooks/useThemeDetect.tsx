import { useEffect, useState } from "react";

/**
 * Use Theme Detect
 *
 * @description This hook detects the user's preferred color scheme and sets the theme accordingly.
 * @returns {boolean} The current theme (true for dark, false for light)
 */
export const useThemeDetect = () => {
  const getCurrentTheme = () =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;

  const [isDarkThemeByDefault, setIsDarkThemeByDefault] = useState(getCurrentTheme());
  const mediaQueryListener = (e: { matches: boolean | ((prevState: boolean) => boolean) }) => {
    setIsDarkThemeByDefault(e.matches);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      darkThemeMediaQuery.addEventListener("change", mediaQueryListener);
      return () => {
        darkThemeMediaQuery.removeEventListener("change", mediaQueryListener);
      };
    } else {
      return () => {};
    }
  }, []);

  return isDarkThemeByDefault;
};

export default useThemeDetect;
