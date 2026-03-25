"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Upload, ImagePlus, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image_url?: string;
  link: string;
  active: boolean;
  created_at?: string;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    link: "/products",
    image_url: "",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBanner = async () => {
    if (!form.title.trim()) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("banners").insert([
        {
          title: form.title,
          subtitle: form.subtitle,
          link: form.link,
          image_url: form.image_url,
          active: true,
        },
      ]);

      if (error) throw error;

      setForm({ title: "", subtitle: "", link: "/products", image_url: "" });
      setUploadMode(false);
      fetchBanners();
    } catch (error) {
      console.error("Error adding banner:", error);
      alert("Failed to add banner");
    } finally {
      setSaving(false);
    }
  };

  const toggleBanner = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("banners")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error("Error toggling banner:", error);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground text-sm">Manage promotional banners</p>
        </div>
        <button
          onClick={() => setUploadMode(!uploadMode)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> {uploadMode ? "Cancel" : "Add Banner"}
        </button>
      </div>

      <div className="space-y-5">
        {/* Upload Area */}
        {uploadMode && (
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold mb-4">Upload New Banner</h2>
            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <div className="font-medium mb-1">Drop your banner image here</div>
              <div className="text-sm text-muted-foreground mb-4">Recommended size: 1200 × 400px</div>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm hover:border-primary transition-colors">
                <Upload className="w-4 h-4" /> Upload Image
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Banner Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Summer Sale"
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Short description"
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Link URL</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/products"
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addBanner}
                  disabled={saving || !form.title.trim()}
                  className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Banners */}
        <div className="bg-white rounded-2xl border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Active Banners ({banners.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {banners.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <ImagePlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No banners yet</p>
              </div>
            ) : (
              banners.map((banner) => (
                <div key={banner.id} className="p-4 flex items-center gap-4">
                  <div className="w-28 h-16 bg-gradient-to-r from-primary/30 to-secondary rounded-xl shrink-0 flex items-center justify-center text-2xl">
                    🖼️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{banner.title}</div>
                    <div className="text-xs text-muted-foreground mb-2">{banner.subtitle}</div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          banner.active
                            ? "bg-green-50 text-green-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {banner.active ? "Active" : "Inactive"}
                      </span>
                      <button
                        className="text-xs text-primary hover:underline"
                        onClick={() => toggleBanner(banner.id, banner.active)}
                      >
                        Toggle
                      </button>
                    </div>
                  </div>
                  <button
                    className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                    onClick={() => deleteBanner(banner.id)}
                    disabled={saving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}