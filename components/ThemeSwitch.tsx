"use client";

import { useTheme } from "next-themes";
import { useHasMounted } from "@/hooks";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const hasMounted = useHasMounted();

  return (
    <select
      value={hasMounted ? theme : "system"}
      onChange={e => setTheme(e.target.value)}
    >
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
};

export default ThemeSwitch;
