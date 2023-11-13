import React from "react";
import Link from "next/link";
import Image from "next/image";

import Nav from "@/components/Nav";
import Avatar from "@/assets/avatar.jpeg";

export default function About() {
  return (
    <>
      <Nav />
      <div className="mt-10">
        <div className="flex items-end">
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

        <div className="mt-5">
          <p>
            I graduated as an architecture student, currently a Web Frontend
            Developer.
          </p>
          <p>Lover of architecture, movie, manga, coffee and aquarium.</p>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <p>Here is my social media:</p>
          <ul className="dark:text-header_dark text-header">
            <li>
              <Link href="https://www.instagram.com/alexyin0978/">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com/alexyin0978">Twitter</Link>
            </li>
          </ul>
          <p>Feel free to chat with me!</p>
        </div>
      </div>
    </>
  );
}
