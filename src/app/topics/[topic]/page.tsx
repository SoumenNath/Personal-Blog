import PostImage from "@/app/components/PostImage";

interface Post {
  id: number;
  title: string;
  content: string;
  topic: string;
  imageKey?: string | null;
  createdAt: string;
}

async function getPostsByTopic(topic: string): Promise<Post[]> {
  const res = await fetch(`http://localhost:3000/api/posts?topic=${encodeURIComponent(topic)}`, {
    cache: "no-store", // always fetch fresh
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function TopicPage({ params }: { params: { topic: string } }) {
  const topic = params.topic;
  const posts = await getPostsByTopic(topic);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{topic} Posts</h1>

      {posts.length === 0 ? (
        <p>No posts found for this topic.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-500 mb-2">{post.topic}</p>
              {post.imageKey && <PostImage imageKey={post.imageKey} alt={post.title} width={600} height={300} />}
              <p className="text-gray-700">{post.content.slice(0, 150)}...</p>
              <a
                href={`/post/${post.id}`}
                className="text-blue-600 hover:underline mt-2 block"
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
