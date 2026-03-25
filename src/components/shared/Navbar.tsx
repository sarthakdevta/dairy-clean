"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Search, User, Menu, X, Milk } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/orders", label: "My Orders" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Milk className="w-5 h-5 text-white" />
            </div>
            DairyFresh
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            {/* CART */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-muted">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* DYNAMIC LOGIN/LOGOUT */}
            {user ? (
              <button 
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
              >
                <User className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium">
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* MOBILE MENU */}
            <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <input
              type="search"
              placeholder="Search products..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        )}

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden border-t py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block px-3 py-2 text-sm hover:bg-muted" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            {/* Mobile Logout/Login */}
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-500">
                Logout
              </button>
            ) : (
              <Link href="/login" className="block px-3 py-2 text-sm hover:bg-muted" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}