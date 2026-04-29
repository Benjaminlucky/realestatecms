import { notFound } from "next/navigation";
import { housesApi, settingsApi } from "@/lib/api";
import { SITE_CONFIG, SITE_URL } from "@/config/site";
import HouseDetailClient from "./HouseDetailClient";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const [res, settingsRes] = await Promise.all([
      housesApi.getBySlug(slug),
      settingsApi.getPublic(),
    ]);
    const house = res?.data;
    const s = settingsRes?.settings || {};
    const siteName = s.site_name || SITE_CONFIG.name;
    if (!house) return { title: `Property Not Found — ${siteName}` };

    const title = house.meta_title || `${house.title} — ${siteName}`;
    const bedsText =
      house.bedrooms != null
        ? house.bedrooms === 0
          ? "Self Contain"
          : `${house.bedrooms}-Bedroom`
        : "";
    const description =
      house.meta_description ||
      `${bedsText} ${house.category || ""} for sale in ${house.location || house.state || "Nigeria"}. ${house.price ? `Price: ₦${Number(house.price).toLocaleString("en-NG")}.` : ""}`.trim();

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: house.feature_image ? [house.feature_image] : [],
        url: `${SITE_URL}/houses/${slug}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: house.feature_image ? [house.feature_image] : [],
      },
    };
  } catch {
    return { title: `House Listing — ${SITE_CONFIG.name}` };
  }
}

export default async function HouseDetailPage({ params }) {
  const { slug } = await params;

  let house = null;
  let settings = {};
  let related = [];

  try {
    const [houseRes, settingsRes] = await Promise.all([
      housesApi.getBySlug(slug),
      settingsApi.getPublic(),
    ]);
    house = houseRes?.data || null;
    settings = settingsRes?.settings || {};
  } catch {
    notFound();
  }

  if (!house) notFound();

  // Fetch related houses — same state + category, exclude current
  try {
    const relatedRes = await housesApi.getAll({
      state: house.state,
      category: house.category,
      perPage: 4,
    });
    related = (relatedRes?.data || [])
      .filter((h) => h.slug !== slug)
      .slice(0, 3);
  } catch {
    related = [];
  }

  return (
    <HouseDetailClient house={house} settings={settings} related={related} />
  );
}
