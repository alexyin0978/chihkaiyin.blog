import React from "react";
import Link from "next/link";
import { Merriweather } from "next/font/google";
import { Montserrat } from "@next/font/google";

import { getAllPostsMetaDatas, PostMetaData } from "@/utils/readPost";

import { SelfIntro } from "@/components/SelfIntro";
import Nav from "@/components/Nav";

export const metadata = {
  title: {
    default: "CHIHKAI_YIN",
    template: "%s",
  },
  metadataBase: new URL("https://chihkaiyin.blog"),
  creator: "ChihKai Yin",
  description: "A blog built by ChihKai Yin.",
  keywords: [
    "chihkai yin",
    "programming",
    "web development",
    "frontend development",
    "react",
    "nextjs",
    "typescript",
    "express",
    "javascript",
    "vitest",
    "vite",
    "unit test",
  ],
  openGraph: {
    title: "ChihKai Yin",
    description: "I write things I have learned.",
    url: "https://chihkaiyin.blog",
    siteName: "CHIHKAI_YIN.blog",
    locale: "en-US",
    type: "website",
  },
  twitter: {
    title: "ChihKai Yin",
    site: "@alexyin0978",
    creator: "@alexyin0978",
    card: "summary_large_image",
    description: "I write things I have learned.",
  },
};

const merriweather = Merriweather({
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({ subsets: ["latin"] });

function PostListItem(props: PostMetaData) {
  const { title, date, subtitle, fileName } = props;
  return (
    <article
      className={`mt-14 text-black dark:text-white ${merriweather.className}`}
    >
      <header>
        <h3
          className={`text-3xl font-extrabold text-header dark:text-header_dark ${montserrat.className}`}
        >
          <Link href={`/${fileName}`}>{title}</Link>
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <small className="text-xs">{date}</small>
        </div>
      </header>
      <p className="mt-2">{subtitle}</p>
    </article>
  );
}

export default function Home() {
  const postMetaDatas = getAllPostsMetaDatas();

  return (
    <>
      <SelfIntro />
      <main>
        {postMetaDatas.length !== 0 &&
          postMetaDatas.map((topic) => (
            <PostListItem
              key={topic.title + topic.date}
              {...topic}
            />
          ))}
      </main>
    </>
  );
}
