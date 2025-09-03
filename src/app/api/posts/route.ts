import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Topic } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topicParam = searchParams.get("topic");

    let whereClause = undefined;
    if (topicParam && Object.values(Topic).includes(topicParam as Topic)) {
      whereClause = { topic: topicParam as Topic };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/posts failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, topic } = body;

    if (!Object.values(Topic).includes(topic as Topic)) {
      return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: { title, content, topic },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("POST /api/posts failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
