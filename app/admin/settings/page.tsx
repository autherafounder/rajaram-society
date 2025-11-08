'use client';

import { useState, useEffect } from 'react';
import { Settings, Lock, Bell, Save } from 'lucide-react';

interface AdminSettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  notifications: {
    email: boolean;
    documentUploads: boolean;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      documentUploads: true,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    if (settings.newPassword !== settings.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsSaving(false);
      return;
    }

    if (settings.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setSettings({
          ...settings,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (key: keyof AdminSettings['notifications']) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your admin account settings</p>
      </div>

      <div className="space-y-6">
        {/* Password Change */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
          </div>

          {message.text && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                value={settings.currentPassword}
                onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={settings.newPassword}
                onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={settings.confirmPassword}
                onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email notifications</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">Document Upload Alerts</p>
                <p className="text-sm text-gray-600">Get notified when documents are uploaded</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.documentUploads}
                onChange={() => handleNotificationChange('documentUploads')}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

