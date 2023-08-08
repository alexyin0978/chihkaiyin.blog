import { Merriweather, Montserrat } from "next/font/google";
import Markdown from "markdown-to-jsx";

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

type StylingTarget = "headings" | "a" | "blockquote" | "strong" | "code" | "p";
type MarkdownStyles = Record<StylingTarget, string>;

// const markdownStyles: MarkdownStyles = {
//   headings: "text-gray-300",
//   p: "text-base text-gray-300",
//   a: "text-header_dark",
//   blockquote: "text-gray-300",
//   strong: "text-gray-300 font-bold",
//   code: "bg-[#737c99] bg-opacity-20 text-gray-300",
// };

export default function Post({ params }: PostProps) {
  const post = getPost(params.post);
  const postMetaData = post.data as PostMetaData;

  // TODO: I don't know why tailwind is not processing the right style for addProsePrefix
  // I have to hard coded myself
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

  const proseStyles = "";

  return (
    <main className="pt-4">
      <header className="mb-7">
        <h1
          className={`${montserrat.className}  text-4xl sm:text-[40px] sm:leading-10 mb-3 text-header_dark font-extrabold`}
        >
          {postMetaData.title}
        </h1>
        <p className={`text-gray-300 text-sm ${merriweather.className}`}>
          {postMetaData.date}
        </p>
      </header>
      <article
        className={`prose ${merriweather.className} text-gray-300
      prose-headings:text-gray-300 prose-p:text-base prose-p:leading-7 prose-p:text-gray-300
      prose-a:text-header_dark prose-a:underline-offset-4 prose-a:decoration-1
      prose-blockquote:text-gray-300
      prose-strong:text-gray-300 prose-strong:font-bold
      prose-pre:bg-[#011627] prose-pre:rounded-xl prose-pre:p-5 prose-pre:-mx-5

      `}
      >
        <Markdown>{post.content}</Markdown>
      </article>
    </main>
  );
}
