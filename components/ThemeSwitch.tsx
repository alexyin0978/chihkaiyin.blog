"use client";

import { useTheme } from "next-themes";
import { useHasMounted } from "@/hooks";

const THEME_VALUE = {
  // SYSTEM: "system",
  DARK: "dark",
  LIGHT: "light",
};

const switchStyles = {
  sun: {
    positionX: {
      dark: "translate-x-8",
      light: "translate-x-1",
    },
  },
  shadow: {
    positionX: {
      dark: "translate-x-7",
      light: "translate-x-0",
    },
    opacity: {
      dark: "opacity-100",
      light: "opacity-0",
    },
  },
};

const ThemeSwitch = () => {
  const hasMounted = useHasMounted();
  const { theme, setTheme } = useTheme();

  const { sun, shadow } = switchStyles;

  let positionX = hasMounted
    ? theme === THEME_VALUE.DARK
      ? sun.positionX.dark
      : sun.positionX.light
    : sun.positionX.dark;

  let shadowPositionX = hasMounted
    ? theme === THEME_VALUE.DARK
      ? shadow.positionX.dark
      : shadow.positionX.light
    : shadow.positionX.dark;

  let shadowOpacity = hasMounted
    ? theme === THEME_VALUE.DARK
      ? shadow.opacity.dark
      : shadow.opacity.light
    : shadow.opacity.dark;

  const handleSwitchTheme = () => {
    let nextTheme = "";
    if (theme === THEME_VALUE.LIGHT) {
      nextTheme = THEME_VALUE.DARK;
    } else {
      nextTheme = THEME_VALUE.LIGHT;
    }

    setTheme(nextTheme);
  };

  return (
    <div
      className="bg-gray-800 w-14 h-7 rounded-full relative cursor-pointer"
      onClick={handleSwitchTheme}
    >
      <div
        className={`bg-yellow-300 transition-transform rounded-full w-5 h-5 absolute top-[4px] ${positionX}`}
      ></div>
      <div
        className={`bg-gray-800 rounded-full w-4 h-4 absolute top-1 transition-all ${shadowPositionX} ${shadowOpacity}`}
      ></div>
    </div>
  );
};

export default ThemeSwitch;
