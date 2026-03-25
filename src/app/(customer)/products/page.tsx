"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown, Star, X } from "lucide-react";
import { products, categories } from "@/lib/mock-data";
import { useCartStore } from "@/store/cartStore"; // ✅ Import added

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Best Rating", "Newest"];
const types = ["All", "Fresh", "Organic", "Aged", "Salted", "Skimmed", "Classic"];

export default function ProductsPage() {
  // ✅ Add to Cart hook
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [sortBy, setSortBy] = useState("Featured");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchType = selectedType === "All" || p.type.toLowerCase() === selectedType.toLowerCase();
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchSearch && matchCat && matchType && matchPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Best Rating") return b.rating - a.rating;
    return 0;
  });

  const Sidebar = () => (
    <aside className="w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 space-y-6">
        <div>
          <h3 className="font-bold mb-3">Categories</h3>
          <ul className="space-y-1">
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === "all" ? "bg-primary text-white" : "hover:bg-muted"}`}
                onClick={() => setSelectedCategory("all")}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedCategory === cat.slug ? "bg-primary text-white" : "hover:bg-muted"}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  <span>{cat.icon} {cat.name}</span>
                  <span className={`text-xs ${selectedCategory === cat.slug ? "text-white/70" : "text-muted-foreground"}`}>{cat.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Price Range</h3>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="20"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$0</span>
              <span className="font-medium text-primary">${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-3">Product Type</h3>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${selectedType === type ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full py-2 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 border border-border rounded-lg hover:border-foreground transition-colors"
          onClick={() => { setSelectedCategory("all"); setSelectedType("All"); setPriceRange([0, 20]); }}
        >
          <X className="w-3 h-3" /> Clear Filters
        </button>
      </div>
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">All Products</h1>
        <p className="text-muted-foreground">{sorted.length} fresh dairy products available</p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-sm hover:border-primary transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              {sortOptions.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 bg-white h-full overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Filters</h3>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {sorted.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-semibold">No products found</div>
              <div className="text-sm">Try adjusting your filters</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {sorted.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-2xl border border-border hover:shadow-lg transition-all group overflow-hidden">
                  <div className="relative aspect-square bg-muted/20 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-primary text-white text-xs font-semibold rounded-full">{product.badge}</span>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-foreground text-sm font-semibold px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground mb-1">{product.categoryName} · {product.weight}</div>
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                        {product.originalPrice && <span className="text-xs text-muted-foreground line-through ml-1">${product.originalPrice}</span>}
                      </div>
                      {/* ✅ FIXED: Add to Cart Button */}
                      <button
                        disabled={!product.inStock}
                        className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  weight: product.weight, // ✅ correct
});
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}