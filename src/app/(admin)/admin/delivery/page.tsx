"use client";

import { useEffect, useState } from "react";
import { Truck, Star, Phone, CheckCircle, Circle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type DeliveryAgent = {
  id: string;
  name: string;
  phone: string;
  zone: string;
  status: "active" | "offline";
  rating: number;
  activeOrders: number;
  completed: number;
};

type Order = {
  id: string;
  address: string;
  total: number;
  status: string;
  delivery_agent_id?: string;
};

export default function AdminDeliveryPage() {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [unassignedOrders, setUnassignedOrders] = useState<Order[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch agents
      const { data: agentsData } = await supabase
        .from("delivery_agents")
        .select("*")
        .order("name");

      // Fetch unassigned orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .is("delivery_agent_id", null)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(10);

      setAgents(agentsData || []);
      setUnassignedOrders(ordersData || []);
    } catch (error) {
      console.error("Error fetching delivery data:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignOrder = async () => {
    if (!selectedAgent || !selectedOrder) return;
    setAssigning(true);

    try {
      const { error } = await supabase
        .from("orders")
        .update({ delivery_agent_id: selectedAgent, status: "processing" })
        .eq("id", selectedOrder);

      if (error) throw error;

      alert("Order assigned successfully!");
      setSelectedAgent(null);
      setSelectedOrder(null);
      fetchData();
    } catch (error) {
      console.error("Error assigning order:", error);
      alert("Failed to assign order");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Delivery Management</h1>
        <p className="text-muted-foreground text-sm">Manage delivery agents and assign orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Agents", value: agents.length, color: "text-blue-600 bg-blue-50" },
          { label: "Active", value: agents.filter((a) => a.status === "active").length, color: "text-green-600 bg-green-50" },
          { label: "Unassigned Orders", value: unassignedOrders.length, color: "text-yellow-600 bg-yellow-50" },
          { label: "Deliveries Today", value: 23, color: "text-purple-600 bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border border-border p-4 ${stat.color.split(" ")[1]} border-transparent`}>
            <div className={`text-2xl font-bold ${stat.color.split(" ")[0]}`}>{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Agents */}
        <div className="bg-white rounded-2xl border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Delivery Agents</h2>
          </div>
          <div className="divide-y divide-border">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-muted/30 ${selectedAgent === agent.id ? "bg-primary/5" : ""}`}
                onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      {agent.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{agent.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {agent.phone} · Zone: {agent.zone}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-yellow-600 mb-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {agent.rating}
                    </div>
                    <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${agent.status === "active" ? "bg-green-50 text-green-600" : "bg-muted text-muted-foreground"}`}>
                      {agent.status === "active" ? "● Active" : "○ Offline"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                  <span>Active: <span className="font-medium text-foreground">{agent.activeOrders}</span></span>
                  <span>Completed: <span className="font-medium text-foreground">{agent.completed}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assign Orders */}
        <div className="bg-white rounded-2xl border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Assign Orders</h2>
            <p className="text-xs text-muted-foreground mt-1">Select an agent and an unassigned order to assign</p>
          </div>
          <div className="p-4">
            {selectedAgent && (
              <div className="mb-4 p-3 bg-primary/5 rounded-xl text-sm">
                <span className="font-medium">Agent Selected:</span>{" "}
                {agents.find((a) => a.id === selectedAgent)?.name}
              </div>
            )}
            <div className="space-y-2">
              {unassignedOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedOrder === order.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">#{order.id.substring(0, 8)}...</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{order.address}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">₹{Number(order.total).toFixed(2)}</span>
                      {selectedOrder === order.id ? <CheckCircle className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>
              ))}
              {unassignedOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">All orders are assigned!</div>
              )}
            </div>
            {selectedAgent && selectedOrder && (
              <button
                className="w-full mt-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                onClick={assignOrder}
                disabled={assigning}
              >
                {assigning ? "Assigning..." : "Assign Order to Agent"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}