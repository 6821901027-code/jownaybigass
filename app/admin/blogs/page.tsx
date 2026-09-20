import { prisma } from "@/lib/prisma";
import AdminBlogsClient from "@/components/admin/AdminBlogsClient";

export const revalidate = 0;

export default async function AdminBlogsPage() {
  const articles = await prisma.article.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return <AdminBlogsClient initialArticles={articles} />;
}
