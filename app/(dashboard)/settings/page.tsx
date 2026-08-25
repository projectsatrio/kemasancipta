'use client';

import React, { useState, useEffect } from 'react';
import BaseLayout from '@/components/base-layout';
import { supabase } from '@/lib/supabase';
import { UserProfile, Role } from '@/lib/types';

export default function SettingsPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data as UserProfile[]);
    setLoading(false);
  };

  const updateUserRole = async (userId: string, newRole: Role) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    loadUsers();
  };

  return (
    <BaseLayout>
      <h1 className="text-2xl font-bold mb-6">User & Access Settings</h1>
      
      {loading ? (
        <p>Memuat data user...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3">Email</th>
                <th className="p-3">Role Akses</th>
                <th className="p-3">Aksi Ubah Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/50">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className="uppercase text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value as Role)}
                      className="bg-slate-800 border border-slate-700 text-sm rounded p-1.5 focus:outline-none"
                    >
                      <option value="admin">Admin (All Access)</option>
                      <option value="accounting">Accounting</option>
                      <option value="marketing">Marketing</option>
                      <option value="it">IT Department</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BaseLayout>
  );
}
