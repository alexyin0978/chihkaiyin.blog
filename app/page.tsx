import Link from "next/link";
import { Merriweather } from "next/font/google";
import { Montserrat } from "@next/font/google";

import { getAllPostsMetaDatas, PostMetaData } from "@/utils/readPost";

import { SelfIntro } from "@/components/SelfIntro";

const merriweather = Merriweather({
  weight: "300",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
});

const PostListItem = (props: PostMetaData) => {
  const { title, date, subtitle, fileName } = props;
  return (
    <article className={`mt-14 text-white ${merriweather.className}`}>
      <header>
        <h3
          className={`text-3xl font-extrabold text-header_dark ${montserrat.className}`}
        >
          <Link href={`/${fileName}`}>{title}</Link>
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <small className="text-xs">{date}</small>
          {/* TODO: tags links */}
          {/* <small className="text-xs">|</small>
          <small className="text-xs">tags will be here</small> */}
        </div>
      </header>
      <p className="mt-2">{subtitle}</p>
    </article>
  );
};

export default function Home() {
  const postMetaDatas = getAllPostsMetaDatas();

  return (
    <div className="pb-36">
      <SelfIntro />
      <main>
        {postMetaDatas.length !== 0 &&
          postMetaDatas.map((topic, idx) => (
            <PostListItem key={topic.title + idx} {...topic} />
          ))}
      </main>
    </div>
  );
}
