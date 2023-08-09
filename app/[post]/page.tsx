import { Merriweather, Montserrat } from "next/font/google";
import ReactMarkdown from "react-markdown";

import { PostMetaData, getPost } from "@/utils/readPost";

const merriweather = Merriweather({
  weight: "300",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
});

type PostProps = {
  params: {
    post: string;
  };
};

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
  headings: "prose-headings:text-gray-300",
  p: "prose-p:text-base prose-p:leading-7 prose-p:text-gray-300",
  a: "prose-a:text-header_dark prose-a:underline-offset-4 prose-a:decoration-1",
  blockquote: "prose-blockquote:text-gray-300",
  strong: "prose-strong:text-gray-300 prose-strong:font-bold",
  pre: "prose-pre:bg-[#011627] prose-pre:rounded-xl prose-pre:p-5 prose-pre:-mx-5",
  code: "prose-code:before:content-none prose-code:after:content-none prose-code:bg-[#737c99] prose-code:text-gray-300 prose-code:bg-opacity-20 prose-code:rounded-sm prose-code:px-1",
};

export default function Post({ params }: PostProps) {
  const { data: postMetaData, content: postMarkdown } = getPost(params.post);

  const MarkdownComponents: object = {
    // SyntaxHighlight code will go here
  };

  return (
    <main className="pt-4">
      <header className="mb-7">
        <h1
          className={`${montserrat.className}  text-4xl sm:text-[40px] sm:leading-10 mb-3 text-header_dark font-extrabold`}
        >
          {(postMetaData as PostMetaData).title}
        </h1>
        <p className={`text-gray-300 text-sm ${merriweather.className}`}>
          {(postMetaData as PostMetaData).date}
        </p>
      </header>
      <article
        className={`prose text-gray-300 ${proseStyles.headings} 
        ${proseStyles.p} ${proseStyles.a} ${proseStyles.blockquote} 
        ${proseStyles.strong} ${proseStyles.pre}
        ${proseStyles.code} ${merriweather.className}`}
      >
        <ReactMarkdown components={MarkdownComponents}>
          {postMarkdown}
        </ReactMarkdown>
      </article>
    </main>
  );
}
