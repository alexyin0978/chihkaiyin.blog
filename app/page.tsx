import React from "react";

import { getAllPostsMetaDatas } from "@/utils/readPost";

import { SelfIntro } from "@/components/SelfIntro";
import { PostListItem } from "@/components/PostListItem";

export const metadata = {
  title: {
    default: "YIN",
    template: "%s",
  },
  metadataBase: new URL("https://chihkaiyin.blog"),
  creator: "ChihKai Yin",
  description: "A blog built by ChihKai Yin.",
  verification: {
    google: "OClxUvjGT1EoL8xqJME8V429q5i_kN7hylWDgW7gNHc",
  },
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

export default function Home() {
  const postMetaDatas = getAllPostsMetaDatas();

  return (
    <>
      <SelfIntro />
      <main data-testid="home__main">
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
