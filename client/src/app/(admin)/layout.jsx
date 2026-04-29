import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: { default: "Admin — NaijaRealty", template: "%s | Admin NaijaRealty" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
