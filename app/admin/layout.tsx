'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    // Check if admin is authenticated
    const checkAuth = async () => {
      try {
        // Check if we have a flag in localStorage
        const authFlag = localStorage.getItem('adminToken');
        
        if (!authFlag) {
          router.push('/admin/login');
          return;
        }

        // Verify token with backend (cookie is sent automatically)
        const response = await fetch('/api/admin/auth/verify', {
          credentials: 'include',
        });

        if (!response.ok) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state
  if (isLoading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Login page doesn't need sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

