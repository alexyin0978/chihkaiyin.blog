// import { ThemeChanger } from "./ThemeChanger";
import Link from "next/link";
import { Montserrat } from "@next/font/google";

const montserrat = Montserrat({
  weight: "800",
  subsets: ["latin"],
});

const pageTitle = "CHIHKAI_YIN";

export default function Nav() {
  return (
    <nav className="mb-8">
      <Link
        href={"/"}
        className={`text-3xl font-extrabold text-white ${montserrat.className}`}
      >
        {pageTitle}
      </Link>
      {/* TODO: theme button */}
      {/* <ThemeChanger /> */}
    </nav>
  );
}
