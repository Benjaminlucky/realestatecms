"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Home,
  BookOpen,
  MessageSquare,
  Image,
  Settings,
  LogOut,
  Users,
  Building2,
  ChevronLeft,
  Menu,
  X,
  ExternalLink,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { toast } from "sonner";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Lands", href: "/admin/lands", icon: MapPin },
  { label: "Houses", href: "/admin/houses", icon: Home },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Team", href: "/admin/settings/team", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ newEnquiries = 0 }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (href) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    toast.success("Signed out successfully", { id: "logout-success" });
    logout();
  };

  const sidebarWidth = collapsed ? "70px" : "240px";

  const sidebarContent = (
    <div
      style={{
        width: sidebarWidth,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #060B14 0%, #0F172A 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "width 250ms ease",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: collapsed ? "1.25rem 0" : "1.25rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          minHeight: "65px",
        }}
      >
        {!collapsed && (
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.5rem",
                background: "linear-gradient(135deg, #FF6B6B 0%, #E85555 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Building2 size={14} style={{ color: "white" }} />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.875rem",
                  color: "white",
                  lineHeight: 1,
                }}
              >
                NaijaRealty
              </p>
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.3)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Admin
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #FF6B6B 0%, #E85555 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building2 size={14} style={{ color: "white" }} />
          </div>
        )}
        <button
          onClick={() => setCollapsed((p) => !p)}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            cursor: "pointer",
            width: "1.75rem",
            height: "1.75rem",
            borderRadius: "0.375rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.4)",
            transition: "all 150ms",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={14}
            style={{
              transform: collapsed ? "rotate(180deg)" : "none",
              transition: "transform 250ms ease",
            }}
          />
        </button>
      </div>

      {/* Nav links */}
      <nav
        style={{
          flex: 1,
          padding: "0.75rem 0.625rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: collapsed ? 0 : "0.75rem",
                padding: collapsed ? "0.75rem" : "0.6875rem 0.875rem",
                borderRadius: "0.625rem",
                justifyContent: collapsed ? "center" : "flex-start",
                textDecoration: "none",
                background: active
                  ? "linear-gradient(135deg, rgba(255,107,107,0.18) 0%, rgba(255,107,107,0.08) 100%)"
                  : "transparent",
                border: `1px solid ${active ? "rgba(255,107,107,0.25)" : "transparent"}`,
                color: active ? "#FF9B9B" : "rgba(255,255,255,0.5)",
                transition: "all 150ms ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }
              }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              )}
              {/* Enquiries badge */}
              {label === "Enquiries" && newEnquiries > 0 && (
                <span
                  style={{
                    marginLeft: collapsed ? 0 : "auto",
                    position: collapsed ? "absolute" : "static",
                    top: collapsed ? "6px" : "auto",
                    right: collapsed ? "6px" : "auto",
                    background: "#FF6B6B",
                    color: "white",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    width: "1.1rem",
                    height: "1.1rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  {newEnquiries > 9 ? "9+" : newEnquiries}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div
        style={{
          padding: "0.75rem 0.625rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: collapsed ? "0.75rem" : "0.6rem 0.875rem",
            borderRadius: "0.625rem",
            textDecoration: "none",
            color: "rgba(255,255,255,0.3)",
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "all 150ms",
            marginBottom: "0.375rem",
          }}
          title={collapsed ? "View site" : undefined}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.3)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <ExternalLink size={15} style={{ flexShrink: 0 }} />
          {!collapsed && (
            <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
              View Site
            </span>
          )}
        </a>

        {!collapsed && user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.625rem 0.875rem",
              marginBottom: "0.375rem",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF6B6B 0%, #F59E0B 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                {user.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.85)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.3)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.role?.replace("_", " ")}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowLogoutModal(true)}
          title={collapsed ? "Sign out" : undefined}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : "0.75rem",
            padding: collapsed ? "0.75rem" : "0.6875rem 0.875rem",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "0.625rem",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "rgba(255,100,100,0.5)",
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.color = "#FCA5A5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,100,100,0.5)";
          }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && (
            <span
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              Sign Out
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop">{sidebarContent}</div>

      {/* Mobile: hamburger + drawer */}
      <div className="admin-sidebar-mobile">
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 50,
            background: "#0F172A",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.625rem",
            padding: "0.5rem",
            cursor: "pointer",
            color: "white",
          }}
        >
          <Menu size={20} />
        </button>

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}
          />
        )}

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 50,
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 300ms ease",
          }}
        >
          <div style={{ position: "relative" }}>
            {sidebarContent}
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "-3rem",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                cursor: "pointer",
                color: "white",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div
          onClick={() => setShowLogoutModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0F172A",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1rem",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "360px",
              boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.875rem",
              }}
            >
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "0.625rem",
                  background: "rgba(239,68,68,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LogOut size={16} style={{ color: "#FCA5A5" }} />
              </div>
              <p
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "white",
                  margin: 0,
                }}
              >
                Sign out?
              </p>
            </div>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
                margin: "0 0 1.25rem",
              }}
            >
              You&apos;ll be returned to the login page. Any unsaved changes
              will be lost.
            </p>
            <div style={{ display: "flex", gap: "0.625rem" }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: "0.625rem",
                  borderRadius: "0.625rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                style={{
                  flex: 1,
                  padding: "0.625rem",
                  borderRadius: "0.625rem",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                  color: "white",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-sidebar-mobile { display: none; }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none; }
          .admin-sidebar-mobile  { display: block; }
        }
      `}</style>
    </>
  );
}
