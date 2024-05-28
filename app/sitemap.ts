import { getAllPostsMetaDatas } from "@/utils/readPost";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = "https://chihkaiyin.blog";
  const staticPageList = [
    {
      url: `${BASE_URL}`,
    },
    {
      url: `${BASE_URL}/about`,
    },
  ];

  const postMetaDatas = getAllPostsMetaDatas();
  const blogPostPageList = postMetaDatas.map((post) => ({
    url: `${BASE_URL}/${post.fileName}`,
  }));

  return [...staticPageList, ...blogPostPageList];
}
