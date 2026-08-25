'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Role, UserProfile } from '@/lib/types';

interface MenuConfig {
  title: string;
  path: string;
  role: Role;
}

const MENU_ITEMS: MenuConfig[] = [
  { title: 'Accounting', path: '/accounting', role: 'accounting' },
  { title: 'Marketing', path: '/marketing', role: 'marketing' },
  { title: 'IT Department', path: '/it-department', role: 'it' },
  { title: 'Settings', path: '/settings', role: 'admin' },
];

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) setProfile(data as UserProfile);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Cek apakah user berhak mengakses menu tertentu
  const hasAccess = (requiredRole: Role) => {
    if (!profile) return false;
    if (profile.role === 'admin') return true; // Admin bisa akses semua
    return profile.role === requiredRole;
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading System...</div>;
  }

  return (
    <div className={darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="text-xl font-bold mb-8 tracking-wide text-indigo-500">ERP SYSTEM</div>
            <nav className="space-y-2">
              <Link
                href="/"
                className={`block p-3 rounded-lg font-medium transition-colors ${
                  pathname === '/' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Dashboard
              </Link>

              {MENU_ITEMS.map((item) => {
                const canAccess = hasAccess(item.role);
                const isActive = pathname === item.path;

                return (
                  <div key={item.path}>
                    {canAccess ? (
                      <Link
                        href={item.path}
                        className={`block p-3 rounded-lg font-medium transition-colors ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      /* Tampilan Menu Terkunci */
                      <div
                        className="flex items-center justify-between p-3 rounded-lg font-medium opacity-40 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed select-none"
                        title="Akses Terkunci"
                      >
                        <span>{item.title}</span>
                        <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20">
                          Locked
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* User Info & Controls */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full text-xs p-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:opacity-80 transition"
            >
              Mode: {darkMode ? '🌙 Gelap' : '☀️ Cerah'}
            </button>
            <div className="text-xs">
              <p className="font-semibold">{profile?.email}</p>
              <p className="text-indigo-400 capitalize">Role: {profile?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full p-2 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded transition"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
