"use client";

import { useEffect, useState } from "react";
import { Search, UserCheck, UserX, Loader2, MoreVertical, Ban, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    phone?: string;
    role?: string;
    status?: string;
  };
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Note: Supabase Auth users need to be fetched via admin API or RPC
      // For now, we'll use a simple approach with metadata
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback: Show empty state
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    setUpdating(userId);
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const { error } = await supabase
        .from("user_profiles")
        .update({ status: newStatus })
        .eq("id", userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user status");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter((user) => {
    const name = user.user_metadata?.name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const phone = user.user_metadata?.phone?.toLowerCase() || "";
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  const activeCount = users.filter((u) => u.user_metadata?.status !== "inactive").length;
  const inactiveCount = users.length - activeCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm">{users.length} registered users</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <UserCheck className="w-4 h-4" />
            {activeCount} active
          </div>
          <span className="text-muted-foreground">·</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <UserX className="w-4 h-4" />
            {inactiveCount} inactive
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    {search ? "No users found" : "No users yet"}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const status = user.user_metadata?.status || "active";
                  const name = user.user_metadata?.name || user.email?.split("@")[0] || "Unknown";
                  
                  return (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {name[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">
                        {user.user_metadata?.phone || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm hidden sm:table-cell">
                        <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                          {user.user_metadata?.role || "customer"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                            status === "active"
                              ? "bg-green-50 text-green-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className={`p-1.5 rounded-lg hover:bg-muted transition-colors ${
                              status === "active" ? "text-muted-foreground hover:text-red-500" : "text-muted-foreground hover:text-green-500"
                            }`}
                            onClick={() => toggleUserStatus(user.id, status)}
                            disabled={updating === user.id}
                          >
                            {updating === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : status === "active" ? (
                              <Ban className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
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