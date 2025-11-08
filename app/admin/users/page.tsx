'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Ban, CheckCircle, Eye, X } from 'lucide-react';

interface User {
  email: string;
  totalDownloads: number;
  lastDownloadAt: string | null;
  isBlocked: boolean;
}

interface BlockedUser {
  id: string;
  identifier: string;
  type: 'email' | 'ip';
  reason: string;
  blockedAt: string;
  blockedBy: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [blockForm, setBlockForm] = useState({
    identifier: '',
    type: 'email' as 'email' | 'ip',
    reason: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setBlockedUsers(data.blockedUsers || []);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blockForm.identifier || !blockForm.reason) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(blockForm),
      });

      if (response.ok) {
        alert('User blocked successfully');
        setShowBlockForm(false);
        setBlockForm({ identifier: '', type: 'email', reason: '' });
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to block user');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleUnblockUser = async (blockedUserId: string) => {
    if (!confirm('Are you sure you want to unblock this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${blockedUserId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('User unblocked successfully');
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to unblock user');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p className="text-gray-600">Manage users and their download permissions</p>
        </div>
        <button
          onClick={() => setShowBlockForm(!showBlockForm)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Ban className="w-5 h-5" />
          Block User
        </button>
      </div>

      {/* Block User Form */}
      {showBlockForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Block User</h2>
            <button
              onClick={() => {
                setShowBlockForm(false);
                setBlockForm({ identifier: '', type: 'email', reason: '' });
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleBlockUser} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                Email or IP Address
              </label>
              <input
                id="identifier"
                type="text"
                required
                value={blockForm.identifier}
                onChange={(e) => setBlockForm({ ...blockForm, identifier: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="user@example.com or 192.168.1.1"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                id="type"
                value={blockForm.type}
                onChange={(e) => setBlockForm({ ...blockForm, type: e.target.value as 'email' | 'ip' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="email">Email</option>
                <option value="ip">IP Address</option>
              </select>
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                id="reason"
                required
                value={blockForm.reason}
                onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Reason for blocking..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Block User
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBlockForm(false);
                  setBlockForm({ identifier: '', type: 'email', reason: '' });
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blocked Users List */}
      {blockedUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Blocked Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Identifier</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Reason</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Blocked At</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blockedUsers.map((blocked) => (
                  <tr key={blocked.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium">{blocked.identifier}</td>
                    <td className="px-4 py-3 text-gray-600">{blocked.type.toUpperCase()}</td>
                    <td className="px-4 py-3 text-gray-600">{blocked.reason}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(blocked.blockedAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleUnblockUser(blocked.id)}
                        className="flex items-center gap-2 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded transition-colors text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">All Users</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search by email..."
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Downloads</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Download</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const blockedEntry = blockedUsers.find(
                    (b) => b.identifier === user.email && b.type === 'email'
                  );
                  const isBlocked = user.isBlocked || !!blockedEntry;

                  return (
                    <tr key={user.email} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-800">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.totalDownloads}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(user.lastDownloadAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            isBlocked
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isBlocked && blockedEntry ? (
                            <button
                              onClick={() => handleUnblockUser(blockedEntry.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded transition-colors text-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setBlockForm({
                                  identifier: user.email,
                                  type: 'email',
                                  reason: '',
                                });
                                setShowBlockForm(true);
                              }}
                              className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors text-sm"
                            >
                              <Ban className="w-4 h-4" />
                              Block
                            </button>
                          )}
                        </div>
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
  );
}

