import React, { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Merriweather, Montserrat } from "next/font/google";

import {
  PostMetaData,
  getAdjacentPostsMetaDatas,
  getAllPostsMetaDatas,
  getPost,
} from "@/utils/readPost";

import Markdown from "@/components/Markdown";

type PostProps = {
  params: {
    post: string;
  };
};

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const { data: postMetaData } = getPost(params.post);
  return {
    title: `CHIHKAI_YIN - ${postMetaData.title}`,
    description: postMetaData.subtitle,
  };
}

export async function generateStaticParams() {
  // render dynamic route page at build time
  const postMetaDatas = getAllPostsMetaDatas();

  return postMetaDatas.map((post) => ({
    slug: post.fileName,
  }));
}

const merriweather = Merriweather({
  weight: "300",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
});

// TODO: I don't know why tailwind doesn't process the right style for addProsePrefix
// I hard coded the style for now
// type StylingTarget = "headings" | "a" | "blockquote" | "strong" | "code" | "p";
// type MarkdownStyles = Record<StylingTarget, string>;

// const markdownStyles: MarkdownStyles = {
//   headings: "text-gray-300",
//   p: "text-base text-gray-300",
//   a: "text-header_dark",
//   blockquote: "text-gray-300",
//   strong: "text-gray-300 font-bold",
//   code: "bg-[#737c99] bg-opacity-20 text-gray-300",
// };

// const addProsePrefix = (markdownStyles: MarkdownStyles): string => {
//   let result = "";
//   for (const [key, value] of Object.entries(markdownStyles)) {
//     const prefix = `prose-${key}`;

//     const splitStyles = value.split(" ");
//     const stylesWithPrefix = splitStyles
//       .map(style => `${prefix}:${style}`)
//       .join(" ");

//     result = result + stylesWithPrefix + " ";
//   }

//   return result;
// };

const proseStyles = {
  headings: "prose-headings:text-header dark:prose-headings:text-header_dark",
  p: "prose-p:text-base prose-p:leading-7 prose-p:text-black dark:prose-p:text-gray-300",
  a: "prose-a:text-header dark:prose-a:text-header_dark prose-a:underline-offset-4 prose-a:decoration-1",
  blockquote:
    "prose-blockquote:text-yellow-300 dark:prose-blockquote:text-gray-300",
  strong:
    "prose-strong:text-black dark:prose-strong:text-gray-300 prose-strong:font-bold",
  pre: "prose-pre:bg-[#011627] prose-pre:rounded-xl prose-pre:p-5 prose-pre:-mx-5",
};

const postLinkSharedStyle =
  "hover:font-semibold duration-200 transition-['font-weight']";

export default function Post({ params }: PostProps) {
  const { data: postMetaData, content: postMarkdown } = getPost(params.post);
  const { title, date } = postMetaData as PostMetaData;
  const [prevPostMetadata, nextPostMetadata] = getAdjacentPostsMetaDatas(title);

  return (
    <>
      <header className="mb-7 mt-14">
        <h1
          className={`${montserrat.className} text-4xl sm:text-[40px] sm:leading-10 mb-3 text-header dark:text-header_dark font-extrabold`}
        >
          {title}
        </h1>
        <p
          className={`text-black dark:text-gray-300 text-sm ${merriweather.className}`}
        >
          {date}
        </p>
      </header>
      <main className="pt-4">
        <article
          className={`prose text-black dark:text-gray-300 ${proseStyles.headings}
      ${proseStyles.p} ${proseStyles.a} ${proseStyles.blockquote}
      ${proseStyles.strong} ${proseStyles.pre} ${merriweather.className}`}
        >
          <Markdown content={postMarkdown} />
        </article>
      </main>
      <aside className="mt-14 -mb-1">
        <ul className="flex justify-between items-center text-base text-header dark:text-header_dark">
          <li
            className={`${
              !prevPostMetadata ? "invisible" : ""
            } ${postLinkSharedStyle}`}
          >
            <Link href={`/${prevPostMetadata?.fileName}`}>
              ← {prevPostMetadata?.title}
            </Link>
          </li>
          <li
            className={`${
              !nextPostMetadata ? "invisible" : ""
            } ${postLinkSharedStyle}`}
          >
            <Link href={`/${nextPostMetadata?.fileName}`}>
              {nextPostMetadata?.title} →
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
}
