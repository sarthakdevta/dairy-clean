"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, History, User, Milk, X, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/delivery/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/delivery/orders", label: "My Orders", icon: Package },
  { href: "/delivery/history", label: "History", icon: History },
  { href: "/delivery/profile", label: "My Profile", icon: User },
];

export default function DeliverySidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 font-bold">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Milk className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm">Delivery Portal</span>
        </div>
        {mobile && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-sidebar-accent">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors">
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}
