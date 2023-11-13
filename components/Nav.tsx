import React from "react";
import Link from "next/link";
import { Montserrat } from "@next/font/google";

import ThemeSwitch from "./ThemeSwitch";

const montserrat = Montserrat({
  weight: "800",
  subsets: ["latin"],
});

const pageTitle = "CHIHKAI_YIN";

export default function Nav() {
  return (
    <nav className="flex justify-between items-center h-10">
      <Link
        href="/"
        className={`text-2xl sm:text-3xl font-extrabold text-pageTitle dark:text-pageTitle_dark ${montserrat.className}`}
      >
        {pageTitle}
      </Link>
      <ThemeSwitch />
    </nav>
  );
}
