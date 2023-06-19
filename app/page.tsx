import fs from "fs";
import matter from "gray-matter";

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

export default function Home() {
  return (
    <div>
      {getMarkdownMetaData().map((metadata) => (
        <div key={metadata.title + metadata.subtitle}>
          <h3>{metadata.title}</h3>
          <div>time</div>
          <h5>{metadata.subtitle}</h5>
        </div>
      ))}
    </div>
  );
}
