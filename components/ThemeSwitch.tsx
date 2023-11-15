"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useHasMounted } from "@/hooks/useHasMounted";

export const THEME_VALUE = {
  // SYSTEM: "system",
  DARK: "dark",
  LIGHT: "light",
};

export const switchStyles = {
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

function ThemeSwitch({ mockClick }: { mockClick?: () => void }) {
  const hasMounted = useHasMounted();
  const { theme, setTheme } = useTheme();

  const { sun, shadow } = switchStyles;

  const processPositionX = () => {
    if (theme === THEME_VALUE.LIGHT) {
      return sun.positionX.light;
    }
    return sun.positionX.dark; // dark or system
  };

  const processShadowPositionX = () => {
    if (theme === THEME_VALUE.LIGHT) {
      return shadow.positionX.light;
    }
    return shadow.positionX.dark; // dark or system
  };

  const processShadowOpacity = () => {
    if (theme === THEME_VALUE.LIGHT) {
      return shadow.opacity.light;
    }
    return shadow.opacity.dark; // dark or system
  };

  const handleSwitchTheme = () => {
    let nextTheme = "";
    if (theme === THEME_VALUE.LIGHT) {
      nextTheme = THEME_VALUE.DARK;
    } else {
      nextTheme = THEME_VALUE.LIGHT;
    }

    setTheme(nextTheme);

    if (mockClick) {
      mockClick();
    }
  };

  return (
    <button
      type="button"
      className="bg-gray-800 w-14 h-7 rounded-full relative cursor-pointer"
      onClick={handleSwitchTheme}
      data-testid="theme-switch"
    >
      {theme}
      {hasMounted && (
        <>
          <div
            data-testid="theme-switch__sun"
            className={`bg-yellow-300 transition-transform rounded-full w-5 h-5 absolute top-[4px] ${processPositionX()}`}
          />
          <div
            data-testid="theme-switch__shadow"
            className={`bg-gray-800 rounded-full w-4 h-4 absolute top-1 transition-all ${processShadowPositionX()} ${processShadowOpacity()}`}
          />
        </>
      )}
    </button>
  );
}

export default ThemeSwitch;
