import { landsApi, settingsApi } from "@/lib/api";
import { SITE_CONFIG } from "@/config/site";
import LandsClient from "./LandsClient";

export const revalidate = 300;

export async function generateMetadata() {
  try {
    const data = await settingsApi.getPublic();
    const s = data?.settings || {};
    return {
      title: `Land Listings — ${s.site_name || SITE_CONFIG.name}`,
      description: `Browse verified land listings across Nigeria. Find titled plots in Lagos, Abuja, Port Harcourt and more.`,
    };
  } catch {
    return { title: `Land Listings — ${SITE_CONFIG.name}` };
  }
}

export default async function LandsPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const state = params?.state || "";
  const location = params?.location || "";
  const status = params?.status || "";
  const minPrice = params?.minPrice || "";
  const maxPrice = params?.maxPrice || "";
  const title = params?.title || "";
  const size = params?.size || "";

  let lands = [],
    totalPages = 1,
    totalCount = 0;

  try {
    const res = await landsApi.getAll({
      page,
      state,
      location,
      status,
      minPrice,
      maxPrice,
      title_type: title,
      size,
    });
    lands = res?.data || [];
    totalPages = res?.totalPages || 1;
    totalCount = res?.total || 0;
  } catch {
    lands = [];
  }

  return (
    <LandsClient
      initialLands={lands}
      initialPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
      initialFilters={{
        state,
        location,
        status,
        minPrice,
        maxPrice,
        title,
        size,
      }}
    />
  );
}
