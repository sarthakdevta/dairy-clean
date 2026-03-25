"use client";

import { useEffect, useState } from "react";
import { Plus, X, SlidersHorizontal, Loader2, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
type Filter = {
  id: string;
  name: string;
  values: string[];
};

export default function AdminFiltersPage() {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");
  const [newValue, setNewValue] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const { data, error } = await supabase
        .from("product_filters")
        .select("*")
        .order("name");

      if (error) throw error;

      // Transform: group values by filter_id
      const grouped = (data || []).reduce((acc: Record<string, Filter>, item: any) => {
        if (!acc[item.filter_id]) {
          acc[item.filter_id] = { id: item.filter_id, name: item.name, values: [] };
        }
        acc[item.filter_id].values.push(item.value);
        return acc;
      }, {});

      setFilters(Object.values(grouped));
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFilter = async () => {
    if (!newFilterName.trim()) return;
    setSaving(true);

    try {
      // Just create the filter name, values added separately
      const { error } = await supabase
        .from("filter_definitions")
        .insert([{ name: newFilterName.trim() }]);

      if (error) throw error;

      setNewFilterName("");
      fetchFilters();
    } catch (error) {
      console.error("Error adding filter:", error);
      alert("Failed to add filter");
    } finally {
      setSaving(false);
    }
  };

  const addValue = async (filterId: string, filterName: string) => {
    const val = newValue[filterId];
    if (!val?.trim()) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("product_filters")
        .insert([{ filter_id: filterId, name: filterName, value: val.trim() }]);

      if (error) throw error;

      setNewValue((prev) => ({ ...prev, [filterId]: "" }));
      fetchFilters();
    } catch (error) {
      console.error("Error adding value:", error);
      alert("Failed to add value");
    } finally {
      setSaving(false);
    }
  };

  const removeValue = async (filterId: string, val: string) => {
    if (!confirm(`Remove "${val}" from filter?`)) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("product_filters")
        .delete()
        .eq("filter_id", filterId)
        .eq("value", val);

      if (error) throw error;
      fetchFilters();
    } catch (error) {
      console.error("Error removing value:", error);
      alert("Failed to remove value");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading filters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Filters</h1>
        <p className="text-muted-foreground text-sm">Manage product filter options</p>
      </div>

      {/* Add Filter */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Create New Filter</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newFilterName}
            onChange={(e) => setNewFilterName(e.target.value)}
            placeholder="Filter name (e.g. Brand, Size)"
            className="flex-1 px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
          <button
            onClick={addFilter}
            disabled={saving || !newFilterName.trim()}
            className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Filter"}
          </button>
        </div>
      </div>

      {/* Filter List */}
      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.id} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">{filter.name}</h3>
              <span className="ml-auto text-xs text-muted-foreground">{filter.values.length} values</span>
            </div>

            {/* Values */}
            <div className="flex flex-wrap gap-2 mb-4">
              {filter.values.map((val) => (
                <div key={val} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg text-sm">
                  {val}
                  <button
                    className="hover:text-red-500 transition-colors"
                    onClick={() => removeValue(filter.id, val)}
                    disabled={saving}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {filter.values.length === 0 && <span className="text-sm text-muted-foreground">No values yet</span>}
            </div>

            {/* Add Value */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newValue[filter.id] || ""}
                onChange={(e) => setNewValue((prev) => ({ ...prev, [filter.id]: e.target.value }))}
                placeholder="Add a value..."
                className="flex-1 px-3 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                onKeyDown={(e) => { if (e.key === "Enter") addValue(filter.id, filter.name); }}
              />
              <button
                onClick={() => addValue(filter.id, filter.name)}
                disabled={saving}
                className="px-4 py-2 bg-muted hover:bg-primary hover:text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}