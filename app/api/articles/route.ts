import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const articles = await prisma.article.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(articles);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const { title, slug, summary, content, coverImage, category, readTime, isFeatured } = data;

    if (!title || !summary || !content || !coverImage) {
      return NextResponse.json(
        { error: "Title, summary, content, and coverImage are required" },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug: generatedSlug,
        summary,
        content,
        coverImage,
        category: category || "News",
        readTime: readTime || "3 min read",
        isFeatured: Boolean(isFeatured),
        authorId: (session.user as any).id,
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create article" },
      { status: 500 }
    );
  }
}
