"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TOPICS = ["Football", "Kpop", "Technology", "Others"] as const;

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("Football");
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`/api/posts/${params.id}`);
      const post = await res.json();

      setTitle(post.title);
      setContent(post.content);
      setTopic(post.topic);
      setImageKey(post.imageKey ?? null);
      setLoading(false);
    }

    fetchPost();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let updatedImageKey = imageKey;

    // Upload new image if replaced
    if (newImage) {
      const formData = new FormData();
      formData.append("file", newImage);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      updatedImageKey = uploadData.key;
    }

    await fetch(`/api/posts/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        topic,
        imageKey: updatedImageKey,
      }),
    });

    router.push(`/post/${params.id}`);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border p-2 rounded min-h-[150px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <select
          className="w-full border p-2 rounded"
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value as (typeof TOPICS)[number])
          }
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div>
          <p className="text-sm text-gray-600 mb-1">Replace image (optional)</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files?.[0] || null)}
          />
        </div>

        <button
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
