'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileBarChart, Download, Calendar, User, Search, FileDown, Filter } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  documentId: string;
  documentName: string;
  timelineId: number;
  timelineTitle: string;
  userEmail: string | null;
  userIP: string;
  timestamp: string;
  blocked: boolean;
}

interface Statistics {
  totalDownloads: number;
  uniqueUsers: number;
  blockedAttempts: number;
  downloadsToday: number;
  downloadsThisWeek: number;
  downloadsThisMonth: number;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    documentId: '',
    userEmail: '',
    startDate: '',
    endDate: '',
  });

  const fetchAuditLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.documentId) params.append('documentId', filters.documentId);
      if (filters.userEmail) params.append('userEmail', filters.userEmail);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/admin/audit-log?${params.toString()}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setStatistics(data.statistics);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'User Email', 'Document Name', 'Timeline Item', 'IP Address', 'Status'];
    const rows = logs.map((log) => [
      formatDate(log.timestamp),
      log.userEmail || 'Anonymous',
      log.documentName,
      log.timelineTitle,
      log.userIP,
      log.blocked ? 'Blocked' : 'Allowed',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilters({
      documentId: '',
      userEmail: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Audit Log</h1>
        <p className="text-gray-600">Track all document download activities</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Downloads</p>
            <p className="text-2xl font-bold text-gray-800">{statistics.totalDownloads}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Unique Users</p>
            <p className="text-2xl font-bold text-gray-800">{statistics.uniqueUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Blocked Attempts</p>
            <p className="text-2xl font-bold text-red-600">{statistics.blockedAttempts}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">Today</p>
            <p className="text-2xl font-bold text-gray-800">{statistics.downloadsToday}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
            <p className="text-2xl font-bold text-gray-800">{statistics.downloadsThisWeek}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-800">{statistics.downloadsThisMonth}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-gray-800">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="documentId" className="block text-sm font-medium text-gray-700 mb-2">
              Document ID
            </label>
            <input
              id="documentId"
              type="text"
              value={filters.documentId}
              onChange={(e) => setFilters({ ...filters, documentId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Filter by document ID"
            />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
              User Email
            </label>
            <input
              id="userEmail"
              type="email"
              value={filters.userEmail}
              onChange={(e) => setFilters({ ...filters, userEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Filter by email"
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Download History</h2>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No download logs found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Document Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Timeline Item</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">IP Address</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(log.timestamp)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {log.userEmail ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {log.userEmail}
                        </div>
                      ) : (
                        <span className="text-gray-400">Anonymous</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{log.documentName}</td>
                    <td className="px-4 py-3 text-gray-600">{log.timelineTitle}</td>
                    <td className="px-4 py-3 text-gray-600">{log.userIP}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          log.blocked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {log.blocked ? 'Blocked' : 'Allowed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

