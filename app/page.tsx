import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";

const rootPath = () => process.cwd();

const getMarkdownMetaData = () => {
  const fileNames = fs.readdirSync(`${rootPath()}/post`);
  const metadatas = fileNames.map((fileName) => {
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
    summary: "Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
  },
  {
    title: "npm audit: Broken by Design",
    date: "July 7, 2021",
    readingTime: "☕️☕️☕️ 14 min read",
    summary: "Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
  },
  {
    title: "npm audit: Broken by Design",
    date: "July 7, 2021",
    readingTime: "☕️☕️☕️ 14 min read",
    summary: "Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
  },
  {
    title: "npm audit: Broken by Design",
    date: "July 7, 2021",
    readingTime: "☕️☕️☕️ 14 min read",
    summary: "Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
  },
  {
    title: "npm audit: Broken by Design",
    date: "July 7, 2021",
    readingTime: "☕️☕️☕️ 14 min read",
    summary: "Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
  },
];

export default function Home() {
  return (
    <div>
      <div className="flex items-center pb-7 mb-14">
        <div className="w-14 h-14 rounded-full bg-red-300 mr-3.5">{/* avatar */}</div>
        <div className="">
          <p>
            Personal blog by <Link href={"#"}>Yin Chih Kai</Link>
          </p>
          <p>I explain with words and code.</p>
        </div>
      </div>
      <ul>
        {mockTopics.map(({ title, date, readingTime, summary }) => (
          <li key={title}>
            <h3>
              <Link href={"#"}>{title}</Link>
            </h3>
            <div className="flex items-center">
              <small>{date}</small>
              <small>{readingTime}</small>
            </div>
            <p>{summary}</p>
          </li>
        ))}
      </ul>
      {/* {getMarkdownMetaData().map((metadata) => (
        <div key={metadata.title + metadata.subtitle}>
          <h3>{metadata.title}</h3>
          <div className="">time</div>
          <h5>{metadata.subtitle}</h5>
        </div>
      ))} */}
      dddd
    </div>
  );
}
