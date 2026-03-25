"use client";
import { useState } from "react";
import { orders } from "@/lib/mock-data";
import { Navigation, CheckCircle, Phone, Package } from "lucide-react";

const deliveryStatuses = ["Picked Up", "On the Way", "Delivered"];

export default function DeliveryOrdersPage() {
  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const [orderStatusMap, setOrderStatusMap] = useState<Record<string, string>>({});

  const updateStatus = (orderId: string, status: string) => {
    setOrderStatusMap((prev) => ({ ...prev, [orderId]: status }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Active Orders</h1>
        <p className="text-muted-foreground text-sm">{activeOrders.length} orders to deliver</p>
      </div>

      <div className="space-y-4">
        {activeOrders.map((order) => {
          const currentStatus = orderStatusMap[order.id] || "Picked Up";
          const statusIdx = deliveryStatuses.indexOf(currentStatus);

          return (
            <div key={order.id} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold">{order.id}</div>
                  <div className="text-sm text-muted-foreground">{order.address}</div>
                  <div className="text-sm text-muted-foreground mt-1">{order.items.length} items · <span className="font-semibold text-foreground">${order.total.toFixed(2)}</span></div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl border border-border hover:border-primary transition-colors text-muted-foreground hover:text-primary">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl border border-border hover:border-primary transition-colors text-muted-foreground hover:text-primary">
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="bg-muted/30 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground">
                  <Package className="w-3.5 h-3.5" /> Items
                </div>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name} × {item.qty}</span>
                    <span className="text-muted-foreground">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Status Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  {deliveryStatuses.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= statusIdx ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                        {i < statusIdx ? <CheckCircle className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-xs ${i === statusIdx ? "font-semibold text-primary" : "text-muted-foreground"}`}>{s}</span>
                      {i < deliveryStatuses.length - 1 && (
                        <div className={`h-0.5 w-8 sm:w-16 ${i < statusIdx ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {statusIdx < deliveryStatuses.length - 1 && (
                  <button
                    className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
                    onClick={() => updateStatus(order.id, deliveryStatuses[statusIdx + 1])}
                  >
                    Mark as {deliveryStatuses[statusIdx + 1]}
                  </button>
                )}
                {statusIdx === deliveryStatuses.length - 1 && (
                  <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-600 font-semibold rounded-xl text-sm border border-green-200">
                    <CheckCircle className="w-4 h-4" /> Delivered!
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {activeOrders.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <div className="font-semibold">All done for today!</div>
            <div className="text-sm">No more active orders.</div>
          </div>
        )}
      </div>
    </div>
  );
}
