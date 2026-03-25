"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Star, Edit, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
  created_at?: string;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    comment: "",
    rating: 5,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTestimonial = async () => {
    if (!form.name || !form.comment) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("testimonials").insert([
        {
          name: form.name,
          role: form.role,
          comment: form.comment,
          rating: form.rating,
          avatar: form.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
        },
      ]);

      if (error) throw error;

      setForm({ name: "", role: "", comment: "", rating: 5 });
      fetchTestimonials();
    } catch (error) {
      console.error("Error adding testimonial:", error);
      alert("Failed to add testimonial");
    } finally {
      setSaving(false);
    }
  };

  const updateTestimonial = async (id: string) => {
    if (!form.name || !form.comment) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("testimonials")
        .update({
          name: form.name,
          role: form.role,
          comment: form.comment,
          rating: form.rating,
        })
        .eq("id", id);

      if (error) throw error;

      setEditingId(null);
      fetchTestimonials();
    } catch (error) {
      console.error("Error updating testimonial:", error);
      alert("Failed to update testimonial");
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Failed to delete testimonial");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      comment: item.comment,
      rating: item.rating,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", role: "", comment: "", rating: 5 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <p className="text-muted-foreground text-sm">Manage customer reviews displayed on the homepage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Form */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> {editingId ? "Edit" : "Add"} Testimonial
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Customer Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. John Smith"
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Role / Title</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Regular Customer"
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, rating: r })}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        r <= form.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Review</label>
              <textarea
                rows={4}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="What did the customer say?"
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
              />
            </div>
            {editingId ? (
              <div className="flex gap-2">
                <button
                  onClick={() => updateTestimonial(editingId)}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Update"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={addTestimonial}
                disabled={saving || !form.name || !form.comment}
                className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Testimonial"}
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No testimonials yet</p>
              <p className="text-sm">Add your first testimonial using the form</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      {item.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTestimonial(item.id)}
                      disabled={saving}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">"{item.comment}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}