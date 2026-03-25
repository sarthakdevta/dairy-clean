"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Users, DollarSign, TrendingUp, Package, Clock, CheckCircle, Truck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";


const statusColors = {
  pending: "text-yellow-600 bg-yellow-50",
  processing: "text-blue-600 bg-blue-50",
  out_for_delivery: "text-orange-600 bg-orange-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
};

type Order = {
  id: string;
  order_number?: string;
  name: string;
  total_amount?: number;
  final_amount?: number;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
    pending: 0,
    processing: 0,
    outForDelivery: 0,
    deliveredToday: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // ✅ Fetch all orders
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      // ✅ Calculate stats
      const totalOrders = orders?.length || 0;
      const revenue = orders?.reduce((sum, order) => sum + (Number(order.final_amount) || 0), 0) || 0;
      const pending = orders?.filter(o => o.status === "pending").length || 0;
      const processing = orders?.filter(o => o.status === "processing").length || 0;
      const outForDelivery = orders?.filter(o => o.status === "out_for_delivery").length || 0;
      
      // Today's delivered orders
      const today = new Date().toISOString().split("T")[0];
      const deliveredToday = orders?.filter(o => 
        o.status === "delivered" && o.created_at?.startsWith(today)
      ).length || 0;

      setStats({
        totalOrders,
        revenue,
        activeUsers: 0, // Can be fetched from auth.users
        pending,
        processing,
        outForDelivery,
        deliveredToday,
      });

      setRecentOrders(orders || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-blue-600 bg-blue-50">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold mb-0.5">{stats.totalOrders}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-green-600 bg-green-50">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold mb-0.5">₹{stats.revenue.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Revenue</div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-purple-600 bg-purple-50">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold mb-0.5">{stats.activeUsers}</div>
          <div className="text-sm text-muted-foreground">Active Users</div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-orange-600 bg-orange-50">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold mb-0.5">--</div>
          <div className="text-sm text-muted-foreground">Growth</div>
        </div>
      </div>

      {/* Quick Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
          <Clock className="w-6 h-6 text-yellow-600" />
          <div>
            <div className="text-xl font-bold">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
          <Package className="w-6 h-6 text-blue-600" />
          <div>
            <div className="text-xl font-bold">{stats.processing}</div>
            <div className="text-xs text-muted-foreground">Processing</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
          <Truck className="w-6 h-6 text-orange-600" />
          <div>
            <div className="text-xl font-bold">{stats.outForDelivery}</div>
            <div className="text-xs text-muted-foreground">Out for Delivery</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <div className="text-xl font-bold">{stats.deliveredToday}</div>
            <div className="text-xs text-muted-foreground">Delivered Today</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const sc = statusColors[order.status as keyof typeof statusColors] || statusColors.pending;
                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium">
                        {order.order_number || order.id?.substring(0, 8)}...
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{order.name}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">
                        {order.created_at 
                          ? new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A'
                        }
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${sc}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-right">
                        ₹{Number(order.final_amount || order.total_amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}