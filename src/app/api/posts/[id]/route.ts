import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteImageFromS3 } from "@/lib/s3";

interface Params {
  params: { id: string };
}

// GET /api/posts/[id] → fetch single post
export async function GET(req: Request, { params }: Params) {
  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();

    const { title, content, topic, imageKey } = body;

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        topic,
        imageKey,
      },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.error("Update post error:", err);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const { id } = await ctx.params;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete image from S3 if exists
    if (post.imageKey) {
      await deleteImageFromS3(post.imageKey);
    }

    // Delete post from DB
    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete post error:", err);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}