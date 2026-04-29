import { settingsApi } from "@/lib/api";
import { SITE_CONFIG } from "@/config/site";
import ContactClient from "./ContactClient";

export const revalidate = 3600;

export async function generateMetadata() {
  try {
    const data = await settingsApi.getPublic();
    const s = data?.settings || {};
    return {
      title: `Contact Us — ${s.site_name || SITE_CONFIG.name}`,
      description: `Get in touch with our team. We help you find the perfect land or home across Nigeria.`,
    };
  } catch {
    return { title: `Contact Us — ${SITE_CONFIG.name}` };
  }
}

export default async function ContactPage() {
  let settings = {};
  try {
    const data = await settingsApi.getPublic();
    settings = JSON.parse(JSON.stringify(data?.settings || {}));
  } catch {}

  return <ContactClient settings={settings} />;
}
