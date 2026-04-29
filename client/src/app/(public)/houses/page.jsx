import { housesApi, settingsApi } from "@/lib/api";
import { SITE_CONFIG } from "@/config/site";
import HousesClient from "./HousesClient";

export const revalidate = 300;

export async function generateMetadata() {
  try {
    const data = await settingsApi.getPublic();
    const s = data?.settings || {};
    return {
      title: `House Listings — ${s.site_name || SITE_CONFIG.name}`,
      description: `Browse premium house listings across Nigeria. Apartments, duplexes, bungalows and more in Lagos, Abuja, Port Harcourt.`,
    };
  } catch {
    return { title: `House Listings — ${SITE_CONFIG.name}` };
  }
}

export default async function HousesPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const state = params?.state || "";
  const location = params?.location || "";
  const status = params?.status || "";
  const category = params?.category || "";
  const bedrooms = params?.bedrooms || "";
  const maxPrice = params?.maxPrice || "";

  let houses = [],
    totalPages = 1,
    totalCount = 0;

  try {
    const res = await housesApi.getAll({
      page,
      state,
      location,
      status,
      category,
      bedrooms,
      maxPrice,
    });
    houses = res?.data || [];
    totalPages = res?.totalPages || 1;
    totalCount = res?.total || 0;
  } catch {
    houses = [];
  }

  return (
    <HousesClient
      initialHouses={houses}
      initialPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
      initialFilters={{ state, location, status, category, bedrooms, maxPrice }}
    />
  );
}
