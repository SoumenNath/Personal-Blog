import { notFound } from "next/navigation";
import PostImage from "@/app/components/PostImage";

interface Post {
  id: number;
  title: string;
  content: string;
  topic: string;
  imageKey?: string | null;
  createdAt: string;
}

async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-4">Topic: {post.topic}</p>

      {post.imageKey && <PostImage imageKey={post.imageKey} alt={post.title} />}

      <article className="whitespace-pre-line text-lg">{post.content}</article>
      <a
      href={`/post/${post.id}/edit`}
      className="text-blue-600 hover:underline"
      >
      Edit Post
      </a>
    </div>
  );
}
