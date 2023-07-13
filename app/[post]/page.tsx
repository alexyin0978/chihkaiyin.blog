import { getPostContent } from "@/utils/readPost";

type PostProps = {
  params: {
    post: string;
  };
};

export default function Post({ params }: PostProps) {
  const postContent = getPostContent(params.post);
  console.log(postContent);
  return (
    <div>
      My post: {params.post}
      <p>{postContent}</p>
    </div>
  );
}
