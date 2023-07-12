import Link from "next/link";
import Image from "next/image";
import { Merriweather } from "next/font/google";

import Avatar from "/assets/avatar.jpeg";

const merriweather = Merriweather({
  weight: "300",
  subsets: ["latin"],
});

export const SelfIntro = () => {
  return (
    <aside className="flex items-center pb-7 mb-12">
      {/* avatar */}
      <div className="w-16 h-16 rounded-full mr-4 border border-gray-400 overflow-hidden pb-5">
        <Image
          src={Avatar}
          width={60}
          height={107}
          alt="avatar"
          className="-mt-[23px] ml-[0.5px]"
        />
      </div>
      {/* intro */}
      <div className={`text-white ${merriweather.className}`}>
        <p>
          Personal blog by{" "}
          <Link
            href={"https://www.linkedin.com/in/alexyin0978/"}
            className="text-header_dark underline underline-offset-2"
          >
            ChihKai Yin
          </Link>
          .
        </p>
        <p className="mt-1">I write things I have learned</p>
      </div>
    </aside>
  );
};
