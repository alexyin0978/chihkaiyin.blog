import fs from "fs";
import matter from "gray-matter";

export interface PostMetaData {
  fileName: string;
  title: string;
  subtitle: string;
  date: string;
}

export const getMarkdownMetaData = () => {
  const rootPath = () => process.cwd();

  const fileNames = fs.readdirSync(`${rootPath()}/post`);
  const metadatas = fileNames.map(fileName => {
    const markdown = fs.readFileSync(`${rootPath()}/post/${fileName}`, "utf-8");
    const { data } = matter(markdown);

    // add fileName to data
    const fileNameWithoutExtension = fileName.split(".")[0];
    data.fileName = fileNameWithoutExtension;

    return data as PostMetaData;
  });

  return metadatas;
};
