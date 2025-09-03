import Image from "next/image";
import { notFound } from "next/navigation";

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`, {
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

      {post.imageKey && (
        <div className="relative w-full h-96 mb-6">
          <Image
            src={`https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${post.imageKey}`}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <p className="text-lg leading-relaxed whitespace-pre-line">
        {post.content}
      </p>
    </div>
  );
}
