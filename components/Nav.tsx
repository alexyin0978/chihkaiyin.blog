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
    <nav className="flex mb-8 justify-between items-center">
      <Link
        href={"/"}
        className={`text-2xl sm:text-3xl font-extrabold text-black dark:text-white ${montserrat.className}`}
      >
        {pageTitle}
      </Link>
      <ThemeSwitch />
    </nav>
  );
}
