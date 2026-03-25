import { CheckCircle, Calendar, DollarSign } from "lucide-react";
import { orders } from "@/lib/mock-data";

const deliveredOrders = orders.filter((o) => o.status === "delivered");

export default function DeliveryHistoryPage() {
  const totalEarnings = deliveredOrders.length * 12.5;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Delivery History</h1>
        <p className="text-muted-foreground text-sm">Your completed deliveries</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: CheckCircle, label: "Total Deliveries", value: deliveredOrders.length + 47, color: "text-green-600 bg-green-50" },
          { icon: DollarSign, label: "Total Earnings", value: `$${(totalEarnings + 587.5).toFixed(2)}`, color: "text-blue-600 bg-blue-50" },
          { icon: Calendar, label: "This Month", value: deliveredOrders.length + 12, color: "text-purple-600 bg-purple-50" },
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

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Recent Deliveries</h2>
        </div>
        <div className="divide-y divide-border">
          {[...deliveredOrders, ...deliveredOrders].slice(0, 8).map((order, idx) => (
            <div key={`${order.id}-${idx}`} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{order.id}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">{order.address}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">${order.total.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">{order.date}</div>
                <div className="text-xs text-green-600 font-medium">+$12.50</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
