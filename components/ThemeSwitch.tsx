"use client";

import { useTheme } from "next-themes";
import { useHasMounted } from "@/hooks";

const THEME_VALUE = {
  SYSTEM: "system",
  DARK: "dark",
  LIGHT: "light",
};

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const hasMounted = useHasMounted();

  let positionX = "right-[2px]";

  const handleSwitchTheme = () => {
    if (theme === THEME_VALUE.LIGHT) {
      positionX = "right-[2px]";
      setTheme(THEME_VALUE.DARK);
    } else {
      positionX = "left-[2px]";
      setTheme(THEME_VALUE.LIGHT);
    }
  };

  return (
    <>
      <select
        value={hasMounted ? theme : THEME_VALUE.DARK}
        onChange={e => setTheme(e.target.value)}
      >
        {/* <option value={THEME_VALUE.SYSTEM}>System</option> */}
        <option value={THEME_VALUE.DARK}>Dark</option>
        <option value={THEME_VALUE.LIGHT}>Light</option>
      </select>
      <div
        className="bg-gray-800 w-14 h-7 rounded-full relative cursor-pointer"
        onClick={handleSwitchTheme}
      >
        <div
          className={`bg-yellow-300 transition-all rounded-full w-6 h-6 absolute top-[2px] ${positionX}`}
        ></div>
        {/* <div className="bg-green-300 rounded-full w-6 h-6 absolute top-[2px] right-[2px]"></div> */}
        {/* <div className="bg-yellow-300 rounded-full w-5 h-5 absolute top-1 right-3"></div> */}
      </div>
    </>
  );
};

export default ThemeSwitch;
