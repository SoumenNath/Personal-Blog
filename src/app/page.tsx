"use client";

import { useState, useEffect } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null; // stores S3 key in DB
  createdAt: string;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [urls, setUrls] = useState<Record<number, string>>({}); // postId -> signed URL

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let imageKey: string | null = null;
    let previewUrl: string | null = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      imageKey = data.key;
      previewUrl = data.url;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, imageKey }),
    });

    const newPost: Post = await res.json();
    setPosts([newPost, ...posts]);
    if (previewUrl) {
      setUrls((prev) => ({ ...prev, [newPost.id]: previewUrl }));
    }
    setTitle("");
    setContent("");
    setFile(null);
  }

  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const posts: Post[] = await res.json();

    // Get signed URLs for posts with images
    for (const post of posts) {
      if (post.imageUrl) {
        const res = await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: post.imageUrl }),
        });
        const data = await res.json();
        setUrls((prev) => ({ ...prev, [post.id]: data.url }));
      }
    }

    setPosts(posts);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blog App (Private S3)</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Create Post
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.content}</p>
            {post.imageUrl && urls[post.id] && (
              <img src={urls[post.id]} alt="" className="mt-2 w-64" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
