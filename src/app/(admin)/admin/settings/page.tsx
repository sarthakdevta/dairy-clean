"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Settings = {
  store_name: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  delivery_fee: number;
  free_delivery_above: number;
  delivery_zones: string;
  email_notifications: boolean;
  sms_alerts: boolean;
  weekly_report: boolean;
  low_stock_alerts: boolean;
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    store_name: "DairyFresh",
    phone: "+91 98765 43210",
    email: "hello@dairyfresh.com",
    address: "123 Dairy Farm Road, Freshville",
    description: "Delivering the freshest dairy products straight from local farms to your doorstep every day.",
    delivery_fee: 4.99,
    free_delivery_above: 30,
    delivery_zones: "North, South, East, West",
    email_notifications: true,
    sms_alerts: true,
    weekly_report: false,
    low_stock_alerts: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      // Check if settings exist
      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from("settings")
          .update(settings)
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from("settings").insert([settings]);
        if (error) throw error;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground text-sm">Configure your store settings</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {saved && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
            ✓ Settings saved successfully!
          </div>
        )}

        <div className="space-y-5 max-w-2xl">
          {/* Store Info */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold mb-4">Store Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Store Name</label>
                <input
                  type="text"
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Store Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Store Description</label>
                <textarea
                  rows={3}
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold mb-4">Delivery Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={settings.delivery_fee}
                    onChange={(e) => setSettings({ ...settings, delivery_fee: Number(e.target.value) })}
                    step="0.01"
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Free Delivery Above (₹)</label>
                  <input
                    type="number"
                    value={settings.free_delivery_above}
                    onChange={(e) => setSettings({ ...settings, free_delivery_above: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Delivery Zones</label>
                <input
                  type="text"
                  value={settings.delivery_zones}
                  onChange={(e) => setSettings({ ...settings, delivery_zones: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold mb-4">Notifications</h2>
            <div className="space-y-3">
              {[
                { label: "Email notifications for new orders", key: "email_notifications" },
                { label: "SMS alerts for delivery updates", key: "sms_alerts" },
                { label: "Weekly sales report", key: "weekly_report" },
                { label: "Low stock alerts", key: "low_stock_alerts" },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-primary w-4 h-4"
                    checked={settings[item.key as keyof Settings] as boolean}
                    onChange={(e) =>
                      setSettings({ ...settings, [item.key]: e.target.checked })
                    }
                  />
                  <span className="text-sm">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}