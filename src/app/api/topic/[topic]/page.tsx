import Link from "next/link";
import { Post } from "@prisma/client";

async function getPosts(topic: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?topic=${topic}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function TopicPage({ params }: { params: { topic: string } }) {
  const posts = await getPosts(params.topic);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Posts about {params.topic}</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        posts.map((post:  Post) => (
          <div key={post.id} className="border-b py-4">
            <Link href={`/post/${post.id}`}>
              <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
