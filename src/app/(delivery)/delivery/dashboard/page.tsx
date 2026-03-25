import { Package, CheckCircle, Clock, Star, TrendingUp, Navigation } from "lucide-react";
import { orders } from "@/lib/mock-data";

export default function DeliveryDashboard() {
  const myOrders = orders.slice(0, 3);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Good morning, John! 👋</h1>
        <p className="text-muted-foreground text-sm">Here's your delivery summary for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Package, label: "Assigned Today", value: 5, color: "text-blue-600 bg-blue-50" },
          { icon: CheckCircle, label: "Completed", value: 3, color: "text-green-600 bg-green-50" },
          { icon: Clock, label: "Pending", value: 2, color: "text-yellow-600 bg-yellow-50" },
          { icon: Star, label: "My Rating", value: "4.9", color: "text-purple-600 bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-border p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Performance This Week</h2>
          <div className="space-y-3">
            {[
              { label: "Deliveries Completed", value: "23 / 25", pct: 92 },
              { label: "On-time Delivery Rate", value: "96%", pct: 96 },
              { label: "Customer Satisfaction", value: "4.9 / 5.0", pct: 98 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Navigation className="w-4 h-4 text-primary" /> Today's Route</h2>
          <div className="bg-muted/40 rounded-xl h-40 flex items-center justify-center text-muted-foreground text-sm border border-border">
            <div className="text-center">
              <Navigation className="w-8 h-8 mx-auto mb-2" />
              Map View Placeholder
              <div className="text-xs mt-1">5 stops · ~12 km</div>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Orders */}
      <div className="bg-white rounded-2xl border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold">Today's Assigned Orders</h2>
          <a href="/delivery/orders" className="text-sm text-primary hover:underline">View all</a>
        </div>
        <div className="divide-y divide-border">
          {myOrders.map((order) => (
            <div key={order.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{order.id}</div>
                <div className="text-xs text-muted-foreground">{order.address}</div>
                <div className="text-xs text-muted-foreground">{order.items.length} items · ${order.total.toFixed(2)}</div>
              </div>
              <button className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                Navigate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
