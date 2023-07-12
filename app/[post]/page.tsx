export default function Post({ params }: { params: { post: string } }) {
  return <div>My post: {params.post}</div>;
}
