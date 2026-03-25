"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    weight: "",
    type: "",
    category: "",
    badge: "",
    inStock: true,
    image: "",
  });

  // Fetch categories on mount
  useState(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("products").insert([
        {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          original_price: form.originalPrice ? Number(form.originalPrice) : null,
          weight: form.weight,
          type: form.type,
          category: form.category,
          category_name: categories.find((c) => c.slug === form.category)?.name || "",
          badge: form.badge || null,
          in_stock: form.inStock,
          image: form.image,
          rating: 4.5,
          reviews: 0,
        },
      ]);

      if (error) throw error;

      alert("Product added successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      console.error("Error adding product:", error);
      alert("Failed to add product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground text-sm">Fill in the details to add a new product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Product Information */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold mb-4">Product Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Full Cream Milk"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description *</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your product..."
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Price (₹) *</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00"
                      step="0.01"
                      required
                      className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Original Price (₹)</label>
                    <input
                      type="number"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Weight / Size</label>
                    <input
                      type="text"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      placeholder="e.g. 1 Litre, 250g"
                      className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Product Type</label>
                    <input
                      type="text"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      placeholder="e.g. Fresh, Organic, Aged"
                      className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold mb-4">Product Images</h2>
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setForm({ ...form, image: "" }); }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                  <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <div className="font-medium mb-1">Drag & drop images here</div>
                  <div className="text-sm text-muted-foreground mb-4">or click to browse files</div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <span className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm hover:border-primary transition-colors">
                    <Upload className="w-4 h-4" /> Upload Image
                  </span>
                  <div className="text-xs text-muted-foreground mt-3">Supports: JPG, PNG, WebP (max 5MB)</div>
                </label>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold mb-4">Category & Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Badge / Label</label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  >
                    <option value="">None</option>
                    <option>Best Seller</option>
                    <option>Organic</option>
                    <option>Premium</option>
                    <option>Sale</option>
                    <option>Popular</option>
                    <option>New</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Stock Status</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        checked={form.inStock}
                        onChange={() => setForm({ ...form, inStock: true })}
                        className="accent-primary"
                      />
                      In Stock
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        checked={!form.inStock}
                        onChange={() => setForm({ ...form, inStock: false })}
                        className="accent-primary"
                      />
                      Out of Stock
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold mb-4">Publishing</h2>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? "Publishing..." : "Publish Product"}
                </button>
                <button
                  type="button"
                  className="w-full py-3 border border-border font-medium rounded-xl hover:border-foreground transition-colors text-sm"
                >
                  Save as Draft
                </button>
                <Link href="/admin/products" className="block text-center text-sm text-muted-foreground hover:text-foreground">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}