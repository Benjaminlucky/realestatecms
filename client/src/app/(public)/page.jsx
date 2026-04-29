import { serverFetch } from "@/lib/api";
import { SITE_CONFIG } from "@/config/site";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeClient from "./Homeclient";

export const revalidate = 300;

export async function generateMetadata() {
  try {
    const res = await serverFetch("/settings", { next: { revalidate: 300 } });
    const s = res?.data?.settings || {};
    const siteName = s.site_name || SITE_CONFIG.name;
    const description =
      s.hero_subtext ||
      "Find your perfect property across Nigeria. Verified listings, transparent pricing, trusted agents.";
    return {
      title: `${siteName} — Lands, Houses & Real Estate Investment`,
      description,
      openGraph: { title: siteName, description },
    };
  } catch {
    return { title: SITE_CONFIG.name };
  }
}

export default async function HomePage() {
  const [
    settingsRes,
    featuredLandsRes,
    featuredHousesRes,
    publicStatsRes,
    reviewsRes,
  ] = await Promise.allSettled([
    serverFetch("/settings", { next: { revalidate: 300 } }),
    serverFetch("/lands/featured?limit=6", { next: { revalidate: 300 } }),
    serverFetch("/houses/featured?limit=6", { next: { revalidate: 300 } }),
    serverFetch("/stats/public", { next: { revalidate: 300 } }),
    serverFetch("/reviews?limit=20", { next: { revalidate: 300 } }),
  ]);

  const settings =
    settingsRes.status === "fulfilled"
      ? settingsRes.value?.data?.settings || {}
      : {};

  const lands =
    featuredLandsRes.status === "fulfilled"
      ? featuredLandsRes.value?.data || []
      : [];

  const houses =
    featuredHousesRes.status === "fulfilled"
      ? featuredHousesRes.value?.data || []
      : [];

  const publicStats =
    publicStatsRes.status === "fulfilled"
      ? publicStatsRes.value?.data || null
      : null;

  // Live reviews from DB — Testimonials falls back to hardcoded
  // defaults automatically when this array is empty
  const testimonials =
    reviewsRes.status === "fulfilled" ? reviewsRes.value?.data || [] : [];

  return (
    <>
      <Navbar settings={settings} />
      <main>
        <HomeClient
          lands={lands}
          houses={houses}
          settings={settings}
          publicStats={publicStats}
          testimonials={testimonials}
        />
      </main>
      <Footer settings={settings} />
    </>
  );
}
