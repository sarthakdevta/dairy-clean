"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
  processing: {
    label: "Processing",
    icon: Package,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  delivered: {
    label: "Delivered",
    icon: Clock,
    color: "text-green-600 bg-green-50 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: Clock,
    color: "text-red-600 bg-red-50 border-red-200",
  },
} as const;

type Order = {
  id: string;
  order_number?: string;
  user_id?: string;
  name: string;
  phone: string;
  address: string;
  delivery_address?: string;
  items: any;
  total_amount?: number;
  final_amount?: number;
  total?: number;
  status: keyof typeof statusConfig;
  created_at?: string;
};

const parseItems = (items: any) => {
  if (Array.isArray(items)) return items;
  if (typeof items === "string") {
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  }
  return [];
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login?redirect=/orders");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
        return;
      }

      setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="animate-pulse text-muted-foreground">
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            You haven't placed any orders yet.
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const parsedItems = parseItems(order.items);

            return (
              <div
                key={order.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg">
                      Order #{order.order_number || order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.delivery_address || order.address}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Placed on {order.created_at 
                        ? new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'
                      }
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium border rounded-full ${status.color}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                </div>

                <div className="border-t pt-3 mb-3">
                  {parsedItems.map((item: any, idx: number) => (
                    <div
                      key={item.id || `${item.name}-${idx}`}
                      className="flex justify-between text-sm py-1"
                    >
                      <span className="text-foreground/80">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ✅ FIXED TOTAL */}
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-sm text-muted-foreground">
                    Contact: {order.phone}
                  </span>
                  <span className="font-bold text-lg">
                    ₹{Number(order.final_amount || order.total_amount || order.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}