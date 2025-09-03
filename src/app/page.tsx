import Link from "next/link";
import { Post } from "@prisma/client";

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
    cache: "no-store", // always fresh
  });
  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Latest Posts</h1>
      {posts.map((post: Post) => (
        <div key={post.id} className="border-b py-4">
          <Link href={`/post/${post.id}`}>
            <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
          </Link>
          <p className="text-sm text-gray-500">Topic: {post.topic}</p>
        </div>
      ))}
    </div>
  );
}
