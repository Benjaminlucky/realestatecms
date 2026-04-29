import { blogApi, settingsApi } from "@/lib/api";
import { SITE_CONFIG } from "@/config/site";
import BlogClient from "./BlogClient";

export const revalidate = 300;

export async function generateMetadata() {
  try {
    const data = await settingsApi.getPublic();
    const s = data?.settings || {};
    return {
      title: `Blog & News — ${s.site_name || SITE_CONFIG.name}`,
      description: `Real estate insights, property investment tips, and market updates for Nigerian property buyers and investors.`,
    };
  } catch {
    return { title: `Blog — ${SITE_CONFIG.name}` };
  }
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const category = params?.category || "";

  let posts = [],
    totalPages = 1,
    totalCount = 0,
    categories = [];

  try {
    const [postsRes, catsRes] = await Promise.allSettled([
      blogApi.getAll({ page, category }),
      blogApi.getCategories?.() || Promise.resolve({ data: [] }),
    ]);
    posts = postsRes.status === "fulfilled" ? postsRes.value?.data || [] : [];
    totalPages =
      postsRes.status === "fulfilled" ? postsRes.value?.totalPages || 1 : 1;
    totalCount =
      postsRes.status === "fulfilled" ? postsRes.value?.total || 0 : 0;
    categories =
      catsRes.status === "fulfilled" ? catsRes.value?.data || [] : [];
  } catch {
    posts = [];
  }

  return (
    <BlogClient
      initialPosts={posts}
      initialPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
      categories={categories}
      initialCategory={category}
    />
  );
}
