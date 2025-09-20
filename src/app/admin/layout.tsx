'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SupabaseSignOut } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Home, Mail, Settings, Building, MapPin } from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
    { href: '/admin/properties', label: 'Properties', icon: Building },
    { href: '/admin/contact', label: 'Contact Details', icon: MapPin },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav>
            <ul>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href} className="mb-2">
                    <Link href={link.href}>
                      <span
                        className={`flex items-center p-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}>
                        <link.icon className="w-5 h-5 mr-3" />
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div>
          <SupabaseSignOut />
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
