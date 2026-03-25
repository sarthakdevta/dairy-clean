"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, SlidersHorizontal, ShoppingBag,
  Users, Truck, FileImage, Megaphone, MessageSquare, Settings, Milk, ChevronRight, X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/filters", label: "Filters", icon: SlidersHorizontal },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/delivery", label: "Delivery", icon: Truck },
  {
    label: "Content",
    icon: FileImage,
    children: [
      { href: "/admin/content/homepage", label: "Homepage" },
      { href: "/admin/content/banners", label: "Banners" },
      { href: "/admin/content/testimonials", label: "Testimonials" },
    ],
  },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavItem({ item, pathname, collapsed }: { item: typeof navItems[0]; pathname: string; collapsed: boolean }) {
  const [open, setOpen] = useState(false);

  if ("children" in item && item.children) {
    return (
      <div>
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-sidebar-accent text-sm font-medium ${collapsed ? "justify-center" : "justify-between"}`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-3">
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && item.label}
          </div>
          {!collapsed && <ChevronRight className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} />}
        </button>
        {open && !collapsed && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${pathname === child.href ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent"}`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const href = "href" in item ? item.href : "#";
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${collapsed ? "justify-center" : ""} ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      {!collapsed && item.label}
    </Link>
  );
}

export default function AdminSidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all ${collapsed && !mobile ? "w-16" : "w-64"}`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={`flex items-center gap-2 font-bold ${collapsed && !mobile ? "hidden" : ""}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Milk className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm">Admin Panel</span>
        </div>
        {mobile && (
          <button onClick={onClose} className="ml-auto p-1 rounded-lg hover:bg-sidebar-accent">
            <X className="w-5 h-5" />
          </button>
        )}
        {!mobile && (
          <button className="ml-auto p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors" onClick={() => setCollapsed(!collapsed)}>
            <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.label} item={item} pathname={pathname} collapsed={collapsed && !mobile} />
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-3 border-t border-sidebar-border ${collapsed && !mobile ? "hidden" : ""}`}>
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors">
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}
