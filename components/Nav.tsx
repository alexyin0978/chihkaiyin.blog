import { ThemeChanger } from "./ThemeChanger";
import Link from "next/link";

const pageTitle = "Overreacted";

export default function Nav() {
  return (
    <div className="mb-10">
      <Link href={"/"} className="text-3xl font-extrabold text-white">
        {pageTitle}
      </Link>
      {/* <ThemeChanger /> */}
      {/* TODO: theme button */}
    </div>
  );
}
