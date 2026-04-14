'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Eye,
  CheckCircle,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Inbox,
  MessageCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Toast, { useToast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

interface Feedback {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  inquiry_type: string | null;
  message_type: string;
  message: string;
  created_at: string;
  status: 'new' | 'read' | 'resolved';
}

interface FeedbackStats {
  total: number;
  new: number;
  read: number;
  resolved: number;
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({ total: 0, new: 0, read: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const ITEMS_PER_PAGE = 15;

  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });
      if (filterStatus !== 'all') params.set('status', filterStatus);

      const response = await fetch(`/api/admin/feedback?${params}`, {
        credentials: 'include',
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedbacks || []);
        setTotalItems(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
        setStats(data.stats || { total: 0, new: 0, read: 0, resolved: 0 });
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      showToast('Failed to load feedbacks', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const updateStatus = async (id: string, status: string, previousStatus: string) => {
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, previousStatus }),
      });

      if (response.ok) {
        showToast(`Feedback marked as ${status}`, 'success');
        fetchFeedbacks();
      } else {
        showToast('Failed to update feedback', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/feedback/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showToast('Feedback deleted successfully', 'success');
        setDeleteTarget(null);
        fetchFeedbacks();
      } else {
        showToast('Failed to delete feedback', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      suggestion: 'bg-purple-100 text-purple-800',
      inquiry: 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-700'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const statCards = [
    { title: 'Total Feedback', value: stats.total, icon: MessageSquare, color: 'bg-blue-500' },
    { title: 'New', value: stats.new, icon: Inbox, color: 'bg-indigo-500' },
    { title: 'Read', value: stats.read, icon: Eye, color: 'bg-yellow-500' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'bg-green-500' },
  ];

  return (
    <div>
      <ToastContainer />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Feedback"
        message={`Are you sure you want to delete feedback from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback Management</h1>
        <p className="text-gray-600">View and manage all feedback submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          </div>
          {['all', 'new', 'read', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
            <p className="font-medium">No feedback found</p>
            <p className="text-sm">Adjust your filters or wait for submissions</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feedbacks.map((fb) => (
                    <tr key={fb.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800">{fb.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {fb.email}
                          </div>
                          {fb.phone && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {fb.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {getTypeBadge(fb.message_type)}
                          {fb.inquiry_type && (
                            <p className="text-xs text-gray-500">{fb.inquiry_type}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div>
                          <p className={`text-sm text-gray-700 ${expandedId !== fb.id ? 'line-clamp-2' : ''}`}>
                            {fb.message}
                          </p>
                          {fb.message.length > 80 && (
                            <button
                              onClick={() => setExpandedId(expandedId === fb.id ? null : fb.id)}
                              className="text-xs text-primary hover:underline mt-1"
                            >
                              {expandedId === fb.id ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(fb.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(fb.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {fb.status === 'new' && (
                            <button
                              onClick={() => updateStatus(fb.id, 'read', fb.status)}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                              title="Mark as Read"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {(fb.status === 'new' || fb.status === 'read') && (
                            <button
                              onClick={() => updateStatus(fb.id, 'resolved', fb.status)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Mark as Resolved"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget({ id: fb.id, name: fb.name })}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, totalItems)} of {totalItems}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
