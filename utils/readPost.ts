import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import dayjs from "dayjs";

export interface PostMetaData {
  fileName: string;
  title: string;
  subtitle: string;
  date: string;
}

const POSTS_DIR = "post";
// const POSTS_DIR = "post_test";

const rootPath = () => process.cwd();

const parseMarkdown = (path: string) => {
  const markdown = readFileSync(path, "utf-8");
  return matter(markdown);
};

export const getAllPostsMetaDatas = () => {
  const fileNames = readdirSync(`${rootPath()}/${POSTS_DIR}`);

  const metadatas = fileNames
    .map((fileName) => {
      const { data } = parseMarkdown(`${rootPath()}/${POSTS_DIR}/${fileName}`);

      // add fileName to data
      const fileNameWithoutExtension = fileName.split(".")[0];
      data.fileName = fileNameWithoutExtension;

      return data as PostMetaData;
    })
    .sort((post1, post2) => {
      const date1 = dayjs(post1.date, "YYYY-MM-DD");
      const date2 = dayjs(post2.date, "YYYY-MM-DD");

      const isDate1AfterDate2 = date1.isAfter(date2);

      return isDate1AfterDate2 ? -1 : 1;
    });

  return metadatas;
};

export const getPost = (post: string) => {
  // eslint-disable-next-line implicit-arrow-linebreak
  const markdown = parseMarkdown(`${rootPath()}/${POSTS_DIR}/${post}.md`);

  return {
    data: markdown.data,
    content: markdown.content,
  };
};

export const getAdjacentPostsMetaDatas = (
  currentPostTitle: string,
): [PostMetaData | undefined, PostMetaData | undefined] => {
  const metadatas = getAllPostsMetaDatas();

  const currentPostIndex = metadatas.findIndex(
    (metadata) => metadata.title === currentPostTitle,
  );

  return [metadatas[currentPostIndex - 1], metadatas[currentPostIndex + 1]];
};
