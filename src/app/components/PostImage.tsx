"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface PostImageProps {
  imageKey: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function PostImage({
  imageKey,
  alt,
  width = 800,
  height = 500,
}: PostImageProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageKey) return;

    async function fetchPresignedUrl() {
      setLoading(true);
      try {
        const res = await fetch(`/api/images/${encodeURIComponent(imageKey)}`);
        const data = await res.json();
        if (data.url) setUrl(data.url);
      } catch (err) {
        console.error("Failed to fetch presigned URL", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPresignedUrl();
  }, [imageKey]);

  // Render nothing if no URL yet
  if (!url) return loading ? <p>Loading image...</p> : null;

  return (
    <Image
      src={url}
      alt={alt || "Post image"}
      width={width}
      height={height}
      className="rounded-lg mb-6"
    />
  );
}
