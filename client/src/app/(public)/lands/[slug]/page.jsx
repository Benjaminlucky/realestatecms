import { notFound } from "next/navigation";
import { landsApi, settingsApi } from "@/lib/api";
import { SITE_CONFIG, SITE_URL } from "@/config/site";
import LandDetailClient from "./LandDetailClient";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const [res, settingsRes] = await Promise.all([
      landsApi.getBySlug(slug),
      settingsApi.getPublic(),
    ]);
    const land = res?.data;
    const s = settingsRes?.settings || {};
    const siteName = s.site_name || SITE_CONFIG.name;
    if (!land) return { title: `Land Not Found — ${siteName}` };

    const title = land.meta_title || `${land.estate_name} — ${siteName}`;
    const description =
      land.meta_description ||
      `${land.estate_name} — ${land.size || ""} land for sale in ${land.location || land.state || "Nigeria"}. ${land.title_type ? `Title: ${land.title_type}.` : ""} ${land.price ? `Price: ₦${Number(land.price).toLocaleString("en-NG")}.` : ""}`.trim();

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: land.feature_image ? [land.feature_image] : [],
        url: `${SITE_URL}/lands/${slug}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: land.feature_image ? [land.feature_image] : [],
      },
    };
  } catch {
    return { title: `Land Listing — ${SITE_CONFIG.name}` };
  }
}

export default async function LandDetailPage({ params }) {
  const { slug } = await params;

  let land = null;
  let settings = {};
  let related = [];

  try {
    const [landRes, settingsRes] = await Promise.all([
      landsApi.getBySlug(slug),
      settingsApi.getPublic(),
    ]);
    land = landRes?.data || null;
    settings = settingsRes?.settings || {};
  } catch {
    notFound();
  }

  if (!land) notFound();

  // Fetch related listings (same state, exclude current)
  try {
    const relatedRes = await landsApi.getAll({
      state: land.state,
      status: "available",
      perPage: 4,
    });
    related = (relatedRes?.data || [])
      .filter((l) => l.slug !== slug)
      .slice(0, 3);
  } catch {
    related = [];
  }

  return <LandDetailClient land={land} settings={settings} related={related} />;
}
