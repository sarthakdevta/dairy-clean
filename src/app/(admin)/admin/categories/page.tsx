"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Tag, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
  icon: string;
  slug: string;
  count?: number;
};

const defaultIcons = ["🥛", "🧀", "🧈", "🥄", "🍦", "🥚", "🌾", "🍯"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🥛");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  // ✅ Fetch categories from Supabase
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new category
  const addCategory = async () => {
    if (!newName.trim()) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("categories").insert([
        {
          name: newName.trim(),
          icon: newIcon,
          slug: newName.toLowerCase().replace(/\s+/g, "-"),
        },
      ]);

      if (error) throw error;

      setNewName("");
      setNewIcon("🥛");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Update category
  const updateCategory = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("categories").update({
        name: editName.trim(),
        icon: editIcon,
        slug: editName.toLowerCase().replace(/\s+/g, "-"),
      }).eq("id", id);

      if (error) throw error;

      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete category
  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditIcon("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground text-sm">Manage product categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Category */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Category Icon</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {defaultIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewIcon(icon)}
                    className={`w-8 h-8 rounded-lg text-lg ${
                      newIcon === icon ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                placeholder="🥛"
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Fresh Milk"
                className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
            <button
              onClick={addCategory}
              disabled={saving || !newName.trim()}
              className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">All Categories ({categories.length})</h2>
            </div>
            <div className="divide-y divide-border">
              {categories.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No categories yet</p>
                  <p className="text-sm">Add your first category above</p>
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    {editingId === cat.id ? (
                      /* Edit Mode */
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="text"
                          value={editIcon}
                          onChange={(e) => setEditIcon(e.target.value)}
                          className="w-12 px-2 py-1.5 rounded-lg border border-border text-center text-lg"
                        />
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-border text-sm"
                        />
                        <button
                          onClick={() => updateCategory(cat.id)}
                          disabled={saving}
                          className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">
                          {cat.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{cat.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {cat.count || 0} products · /{cat.slug}
                          </div>
                        </div>
                      </div>
                    )}

                    {editingId !== cat.id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          disabled={saving}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}