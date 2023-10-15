import fs from "fs";
import matter from "gray-matter";
import dayjs from "dayjs";

export interface PostMetaData {
  fileName: string;
  title: string;
  subtitle: string;
  date: string;
}

const rootPath = () => {
  return process.cwd();
};

const parseMarkdown = (path: string) => {
  const markdown = fs.readFileSync(path, "utf-8");
  return matter(markdown);
};

export const getAllPostsMetaDatas = () => {
  const fileNames = fs.readdirSync(`${rootPath()}/post`);
  const metadatas = fileNames
    .map((fileName) => {
      const { data } = parseMarkdown(`${rootPath()}/post/${fileName}`);

      // add fileName to data
      const fileNameWithoutExtension = fileName.split(".")[0];
      data.fileName = fileNameWithoutExtension;

      return data as PostMetaData;
    })
    .sort((post1, post2) => {
      const date1 = dayjs(post1.date, "YYYY-MM-DD");
      const date2 = dayjs(post2.date, "YYYY-MM-DD");

      const isDate1BeforeDate2 = date1.isBefore(date2);

      return isDate1BeforeDate2 ? -1 : 1;
    })
    .reverse();

  return metadatas;
};

export const getPost = (post: string) => {
  return parseMarkdown(`${rootPath()}/post/${post}.md`);
};

export const getAdjacentPostsMetaDatas = (
  currentPostTitle: string,
): [PostMetaData | undefined, PostMetaData | undefined] => {
  const metadatas = getAllPostsMetaDatas();

  const currentPostIndex = metadatas.findIndex((metadata) => {
    return metadata.title === currentPostTitle;
  });

  return [metadatas[currentPostIndex - 1], metadatas[currentPostIndex + 1]];
};
