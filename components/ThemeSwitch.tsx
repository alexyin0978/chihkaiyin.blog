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

  return (
    <select
      value={hasMounted ? theme : THEME_VALUE.SYSTEM}
      onChange={e => setTheme(e.target.value)}
    >
      <option value={THEME_VALUE.SYSTEM}>System</option>
      <option value={THEME_VALUE.DARK}>Dark</option>
      <option value={THEME_VALUE.LIGHT}>Light</option>
    </select>
  );
};

export default ThemeSwitch;
