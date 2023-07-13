import fs from "fs";
import matter from "gray-matter";

export interface PostMetaData {
  fileName: string;
  title: string;
  subtitle: string;
  date: string;
}

const rootPath = () => process.cwd();

const parseMarkdown = (path: string) => {
  const markdown = fs.readFileSync(path, "utf-8");
  return matter(markdown);
};

export const getAllPostsMetaDatas = () => {
  const fileNames = fs.readdirSync(`${rootPath()}/post`);
  const metadatas = fileNames.map(fileName => {
    const { data } = parseMarkdown(`${rootPath()}/post/${fileName}`);

    // add fileName to data
    const fileNameWithoutExtension = fileName.split(".")[0];
    data.fileName = fileNameWithoutExtension;

    return data as PostMetaData;
  });

  return metadatas;
};

export const getPost = (post: string) => {
  return parseMarkdown(`${rootPath()}/post/${post}.md`);
};
