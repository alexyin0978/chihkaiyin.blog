import Link from "next/link";
import Image from "next/image";
import { Merriweather } from "next/font/google";
import { Montserrat } from "@next/font/google";

import fs from "fs";
import matter from "gray-matter";

import Avatar from "/assets/avatar.jpeg";

const rootPath = () => process.cwd();

const getMarkdownMetaData = () => {
  const fileNames = fs.readdirSync(`${rootPath()}/post`);
  const metadatas = fileNames.map(fileName => {
    const markdown = fs.readFileSync(`${rootPath()}/post/${fileName}`, "utf-8");
    const { data } = matter(markdown);

    return data;
  });

  return metadatas;
};

const mockTopics = [
  {
    title: "npm audit: Broken by Design",
    date: "July 7, 2021",
    readingTime: "☕️☕️☕️ 14 min read",
    summary:
      "Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
  },
];

type PostListItemProps = {
  title: string;
  date: string;
  readingTime: string;
  summary: string;
};

const merriweather = Merriweather({
  weight: "300",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
});

const PostListItem = (props: PostListItemProps) => {
  const { title, date, summary } = props;
  return (
    <article className={`mt-14 text-white ${merriweather.className}`}>
      <header>
        <h3
          className={`text-3xl font-extrabold text-header_dark ${montserrat.className}`}
        >
          <Link href={"#"}>{title}</Link>
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <small className="text-xs">{date}</small>
          {/* TODO: tags links */}
          {/* <small className="text-xs">|</small>
          <small className="text-xs">tags will be here</small> */}
        </div>
      </header>
      <p className="mt-2">{summary}</p>
    </article>
  );
};

const SelfIntro = () => {
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

export default function Home() {
  return (
    <div className="pb-36">
      <SelfIntro />
      <main>
        {mockTopics.map((topic, idx) => (
          <PostListItem key={topic.title + idx} {...topic} />
        ))}
      </main>
      {/* {getMarkdownMetaData().map((metadata) => (
        <div key={metadata.title + metadata.subtitle}>
          <h3>{metadata.title}</h3>
          <div className="">time</div>
          <h5>{metadata.subtitle}</h5>
        </div>
      ))} */}
    </div>
  );
}
