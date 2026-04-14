'use client';

import { useEffect, useState } from 'react';
import { FileText, Users, Calendar, MessageSquare, Activity, Clock, Upload } from 'lucide-react';

interface DashboardStats {
  totalDocuments: number;
  totalFeedback: number;
  newFeedback: number;
  recentUploads: number;
}

interface ActivityItem {
  id: string;
  admin_email: string;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    totalFeedback: 0,
    newFeedback: 0,
    recentUploads: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch documents
        const docsRes = await fetch('/api/admin/documents', { credentials: 'include' });
        let totalDocs = 0;
        let recentUploads = 0;
        if (docsRes.ok) {
          const docsData = await docsRes.json();
          totalDocs = docsData.documents?.length || 0;
          recentUploads = (docsData.documents || []).filter((doc: { uploadDate: string }) => {
            const uploadDate = new Date(doc.uploadDate);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return uploadDate > weekAgo;
          }).length;
        }

        // Fetch feedback stats
        const fbRes = await fetch('/api/admin/feedback?limit=1', { credentials: 'include' });
        let totalFb = 0;
        let newFb = 0;
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          totalFb = fbData.stats?.total || 0;
          newFb = fbData.stats?.new || 0;
        }

        // Fetch recent activity
        const actRes = await fetch('/api/admin/audit-log?limit=10', { credentials: 'include' });
        if (actRes.ok) {
          const actData = await actRes.json();
          setRecentActivity(actData.activity || actData.logs || []);
        }

        setStats({
          totalDocuments: totalDocs,
          totalFeedback: totalFb,
          newFeedback: newFb,
          recentUploads,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Documents',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Feedback',
      value: stats.totalFeedback,
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
    {
      title: 'New Feedback',
      value: stats.newFeedback,
      icon: MessageSquare,
      color: 'bg-indigo-500',
      subtitle: 'Unread',
    },
    {
      title: 'Recent Uploads',
      value: stats.recentUploads,
      icon: Upload,
      color: 'bg-orange-500',
      subtitle: 'Last 7 days',
    },
  ];

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      document_upload: '📄 Uploaded document',
      document_delete: '🗑️ Deleted document',
      feedback_received: '📨 New feedback received',
      feedback_read: '👁️ Marked feedback as read',
      feedback_resolved: '✅ Resolved feedback',
      feedback_delete: '🗑️ Deleted feedback',
      login: '🔐 Admin login',
      download: '⬇️ Document downloaded',
    };
    return labels[action] || `🔹 ${action}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
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
              href="/admin/feedback"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <MessageSquare className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">View Feedback</h3>
              <p className="text-sm text-gray-600">
                {stats.newFeedback > 0
                  ? `${stats.newFeedback} new feedback awaiting review`
                  : 'Review and manage feedback submissions'}
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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Clock className="w-10 h-10 mb-2" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {recentActivity.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {getActionLabel(item.action)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      by {item.admin_email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatTimeAgo(item.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
