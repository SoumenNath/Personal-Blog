import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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