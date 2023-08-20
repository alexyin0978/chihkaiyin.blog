import Link from "next/link";
import { Montserrat } from "@next/font/google";

import ThemeSwitch from "./ThemeSwitch";

const montserrat = Montserrat({
  weight: "800",
  subsets: ["latin"],
});

const pageTitle = "CHIHKAI_YIN";

export default function Nav({
  titleSize = "text-2xl sm:text-3xl",
  titleColor = "text-pageTitle dark:text-pageTitle_dark",
}: {
  titleSize?: string;
  titleColor?: string;
}) {
  return (
    <nav className="flex justify-between items-center">
      <Link
        href={"/"}
        className={`${titleSize} font-extrabold ${titleColor} ${montserrat.className}`}
      >
        {pageTitle}
      </Link>
      <ThemeSwitch />
    </nav>
  );
}
