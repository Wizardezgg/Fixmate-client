"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { apiRequest } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { UserProfile, UserRole } from "@/types";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentEmail = (session?.user as { email?: string } | undefined)?.email;

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: UserProfile[] }>(
        "/api/admin/users",
        { auth: true }
      );
      setUsers(res.data || []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setUpdatingId(userId);
    try {
      await apiRequest(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ role }),
      });
      toast.success(`User role updated to '${role}'.`);
      await loadUsers();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update role."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardShell allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            Manage Users
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            View all registered accounts and update user roles.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-on-surface-variant">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="w-10 h-10 text-primary mx-auto opacity-80" />
              <p className="text-sm text-on-surface-variant">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <th className="py-3.5 px-5 font-semibold">User</th>
                    <th className="py-3.5 px-4 font-semibold">Email</th>
                    <th className="py-3.5 px-4 font-semibold">Joined</th>
                    <th className="py-3.5 px-5 font-semibold text-right">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {users.map((u) => {
                    const uid = u._id || u.id || "";
                    const isSelf = u.email === currentEmail;
                    return (
                      <tr
                        key={uid || u.email}
                        className="hover:bg-surface-container-low/50 transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            {u.image ? (
                              <img
                                src={u.image}
                                alt={u.name}
                                className="w-9 h-9 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-semibold text-on-surface">
                              {u.name}
                              {isSelf && (
                                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  You
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <select
                            aria-label={`Role for ${u.name}`}
                            disabled={isSelf || updatingId === uid}
                            value={u.role || "customer"}
                            onChange={(e) =>
                              handleRoleChange(uid, e.target.value as UserRole)
                            }
                            className="h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-xs font-semibold text-on-surface disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <option value="customer">customer</option>
                            <option value="technician">technician</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
