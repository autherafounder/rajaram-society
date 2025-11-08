'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, Users, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    timelineItems: 8,
    recentUploads: 0,
  });

  useEffect(() => {
    // Fetch stats
    fetch('/api/admin/documents', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok && res.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.documents) {
          setStats({
            totalDocuments: data.documents.length,
            timelineItems: 8,
            recentUploads: data.documents.filter((doc: any) => {
              const uploadDate = new Date(doc.uploadDate);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return uploadDate > weekAgo;
            }).length,
          });
        }
      })
      .catch((error) => console.error('Error fetching stats:', error));
  }, []);

  const statCards = [
    {
      title: 'Total Documents',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Timeline Items',
      value: stats.timelineItems,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Recent Uploads',
      value: stats.recentUploads,
      icon: FileText,
      color: 'bg-orange-500',
      subtitle: 'Last 7 days',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/documents"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <FileText className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold text-gray-800 mb-1">Upload Document</h3>
            <p className="text-sm text-gray-600">
              Upload new documents to the timeline
            </p>
          </a>
          <a
            href="/admin/profile"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Users className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold text-gray-800 mb-1">Manage Profile</h3>
            <p className="text-sm text-gray-600">
              Update your admin profile information
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

