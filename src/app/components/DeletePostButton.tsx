"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    setDeleting(true);

    await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });

    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete Post"}
    </button>
  );
}
