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

export default function Post({ params }: PostProps) {
  const post = getPost(params.post);
  const postMetaData = post.data as PostMetaData;
  return (
    <main className="pt-4 pb-36">
      <header className="mb-7">
        <h1
          className={`${montserrat.className} text-[40px] text-header_dark font-extrabold`}
        >
          {postMetaData.title}
        </h1>
        <p className={`text-gray-300 text-sm ${merriweather.className}`}>
          {postMetaData.date}
        </p>
      </header>
      <article
        className={`prose text-gray-300 decoration-header_dark text-base ${merriweather.className}`}
      >
        {/* My post: {params.post} */}
        <Markdown>{post.content}</Markdown>
      </article>
    </main>
  );
}
