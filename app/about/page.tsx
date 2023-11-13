import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Merriweather } from "next/font/google";

import Avatar from "@/assets/avatar.jpeg";

const merriweather = Merriweather({
  weight: "400",
  subsets: ["latin"],
});

export default function About() {
  return (
    <div className="mt-10">
      <div className={`flex items-end ${merriweather.className}`}>
        <div className="w-16 h-16 rounded-full mr-4 border border-gray-400 overflow-hidden pb-5">
          <Image
            src={Avatar}
            width={72}
            alt="avatar"
            className="-mt-[24px] mr-[1px]"
          />
        </div>
        <h3 className="text-2xl">ChihKai Yin</h3>
      </div>

      <div className="mt-8">
        <p>Web Frontend Developer.</p>
        <p className="mt-3">
          Lover of architecture, movie, manga, coffee and aquarium.
        </p>
      </div>

      <div className="mt-3">
        Chat with me via my{" "}
        <span className=" text-header dark:text-header_dark">
          <Link href="https://www.instagram.com/alexyin0978/">Instagram</Link>
        </span>
        ,
        <span className="mx-1 text-header dark:text-header_dark">
          <Link href="https://twitter.com/alexyin0978">Twitter</Link>
        </span>
        or
        <span className="ml-1 text-header dark:text-header_dark">
          <Link href="https://www.linkedin.com/in/alexyin0978/">LinkedIn</Link>
        </span>
        .
      </div>
    </div>
  );
}
