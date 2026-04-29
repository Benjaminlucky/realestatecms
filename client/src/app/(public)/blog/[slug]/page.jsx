import { notFound } from "next/navigation";
import { blogApi, settingsApi } from "@/lib/api";
import { SITE_CONFIG, SITE_URL } from "@/config/site";
import BlogPostClient from "./BlogDetailClient";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const [res, settingsRes] = await Promise.all([
      blogApi.getBySlug(slug),
      settingsApi.getPublic(),
    ]);
    const post = res?.data;
    const s = settingsRes?.settings || {};
    const siteName = s.site_name || SITE_CONFIG.name;
    if (!post) return { title: `Post Not Found — ${siteName}` };

    const title = post.meta_title || `${post.title} — ${siteName}`;
    const description =
      post.meta_description ||
      post.excerpt ||
      `${post.title} — Read on ${siteName}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: post.cover_image ? [post.cover_image] : [],
        url: `${SITE_URL}/blog/${slug}`,
        type: "article",
        publishedTime: post.published_at,
        authors: post.author_name ? [post.author_name] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: post.cover_image ? [post.cover_image] : [],
      },
    };
  } catch {
    return { title: `Blog — ${SITE_CONFIG.name}` };
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  let post = null;
  let settings = {};
  let related = [];

  try {
    const [postRes, settingsRes] = await Promise.all([
      blogApi.getBySlug(slug),
      settingsApi.getPublic(),
    ]);
    post = postRes?.data || null;
    settings = settingsRes?.settings || {};
  } catch {
    notFound();
  }

  if (!post) notFound();

  // Fetch related posts — same category, exclude current slug
  try {
    const catSlug = post.category?.slug || "";
    const relatedRes = await blogApi.getAll({
      category: catSlug,
      perPage: 4,
    });
    related = (relatedRes?.data || [])
      .filter((p) => p.slug !== slug)
      .slice(0, 3);

    // If not enough from same category, fall back to recent
    if (related.length < 3) {
      const recentRes = await blogApi.getRecent(6);
      const recent = (recentRes?.data || []).filter(
        (p) => p.slug !== slug && !related.find((r) => r.slug === p.slug),
      );
      related = [...related, ...recent].slice(0, 3);
    }
  } catch {
    related = [];
  }

  return <BlogPostClient post={post} settings={settings} related={related} />;
}
