import { redirect } from 'next/navigation';

export default function RootPage() {
  // Otomatis arahkan user ke halaman login saat buka domain utama
  redirect('/login');
}
