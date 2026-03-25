"use client";

import { useEffect, useState } from "react";
import { Save, Eye, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type HomepageContent = {
  id: string;
  section: string;
  content: any;
  enabled: boolean;
  updated_at?: string;
};

export default function AdminHomepagePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    hero: {
      headline: "Pure Dairy, Fresh Every Day",
      subheadline: "Enjoy the finest quality dairy products delivered straight from local farms to your doorstep.",
      ctaText: "Order Now",
      ctaLink: "/products",
    },
    featured: {
      title: "Featured Products",
      subtitle: "Hand-picked fresh dairy items",
      productCount: 4,
    },
    whyChooseUs: {
      title: "Why Choose DairyFresh?",
      enabled: true,
    },
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from("homepage_content").select("*");
      if (error) throw error;

      if (data && data.length > 0) {
        const parsed = data.reduce((acc, item) => {
          acc[item.section] = item.content;
          return acc;
        }, {} as any);
        setContent((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(content).map(([section, contentData]) => ({
        section,
        content: contentData,
        enabled: section !== "whyChooseUs" ? true : contentData.enabled,
      }));

      for (const update of updates) {
        const { data: existing } = await supabase
          .from("homepage_content")
          .select("id")
          .eq("section", update.section)
          .single();

        if (existing) {
          await supabase
            .from("homepage_content")
            .update(update)
            .eq("section", update.section);
        } else {
          await supabase.from("homepage_content").insert([update]);
        }
      }

      alert("Homepage content saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Homepage Content</h1>
          <p className="text-muted-foreground text-sm">Edit homepage sections</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm hover:border-foreground transition-colors">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button
            onClick={saveContent}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold mb-4">Hero Section</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Headline</label>
              <input
                type="text"
                value={content.hero.headline}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })}
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subheadline</label>
              <textarea
                rows={2}
                value={content.hero.subheadline}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })}
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">CTA Button Text</label>
                <input
                  type="text"
                  value={content.hero.ctaText}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaText: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">CTA Button Link</label>
                <input
                  type="text"
                  value={content.hero.ctaLink}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaLink: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold mb-4">Featured Products Section</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Section Title</label>
              <input
                type="text"
                value={content.featured.title}
                onChange={(e) => setContent({ ...content, featured: { ...content.featured, title: e.target.value } })}
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subtitle</label>
              <input
                type="text"
                value={content.featured.subtitle}
                onChange={(e) => setContent({ ...content, featured: { ...content.featured, subtitle: e.target.value } })}
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Number of Products to Show</label>
              <select
                value={content.featured.productCount}
                onChange={(e) => setContent({ ...content, featured: { ...content.featured, productCount: Number(e.target.value) } })}
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              >
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
              </select>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold mb-4">Why Choose Us Section</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Section Title</label>
              <input
                type="text"
                value={content.whyChooseUs.title}
                onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, title: e.target.value } })}
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-why"
                checked={content.whyChooseUs.enabled}
                onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, enabled: e.target.checked } })}
                className="accent-primary"
              />
              <label htmlFor="show-why" className="text-sm">Show this section</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}