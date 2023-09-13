"use client";

import React from "react";
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

function ThemeSwitch() {
  const hasMounted = useHasMounted();
  const { theme, setTheme } = useTheme();

  const { sun, shadow } = switchStyles;

  const processPositionX = () => {
    if (theme === THEME_VALUE.DARK) {
      return sun.positionX.dark;
    }
    return sun.positionX.light;
  };

  const processShadowPositionX = () => {
    if (theme === THEME_VALUE.DARK) {
      return shadow.positionX.dark;
    }
    return shadow.positionX.light;
  };

  const processShadowOpacity = () => {
    if (theme === THEME_VALUE.DARK) {
      return shadow.opacity.dark;
    }
    return shadow.opacity.light;
  };

  const handleSwitchTheme = () => {
    let nextTheme = "";
    if (theme === THEME_VALUE.LIGHT) {
      nextTheme = THEME_VALUE.DARK;
    } else {
      nextTheme = THEME_VALUE.LIGHT;
    }

    setTheme(nextTheme);
  };

  // do this to prevent hydration error
  if (!hasMounted) return null;

  return (
    <button
      data-testid="theme-switch"
      type="button"
      className="bg-gray-800 w-14 h-7 rounded-full relative cursor-pointer"
      onClick={handleSwitchTheme}
    >
      <div
        className={`bg-yellow-300 transition-transform rounded-full w-5 h-5 absolute top-[4px] ${processPositionX()}`}
      />
      <div
        className={`bg-gray-800 rounded-full w-4 h-4 absolute top-1 transition-all ${processShadowPositionX()} ${processShadowOpacity()}`}
      />
    </button>
  );
}

export default ThemeSwitch;
