'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Download, Calendar } from 'lucide-react';
import { timelineItems } from '@/data/timeline-items';
import Toast, { useToast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

interface Document {
  id: string;
  name: string;
  timelineId: number;
  timelineTitle: string;
  url: string;
  uploadDate: string;
  size?: number;
  downloadCount?: number;
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    timelineId: '',
    name: '',
  });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/admin/documents', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
        // Fetch download counts after documents load
        fetchDownloadCounts(data.documents || []);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      showToast('Failed to load documents', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDownloadCounts = async (docs: Document[]) => {
    try {
      const response = await fetch('/api/admin/audit-log', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const downloadCounts = new Map<string, number>();

        data.logs.forEach((log: any) => {
          const count = downloadCounts.get(log.documentId) || 0;
          downloadCounts.set(log.documentId, count + 1);
        });

        setDocuments((prevDocs) =>
          prevDocs.map((doc) => ({
            ...doc,
            downloadCount: downloadCounts.get(doc.id) || 0,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching download counts:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Client-side validation
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];

      if (!allowedTypes.includes(file.type)) {
        showToast('Please upload a PDF, DOC/DOCX, or XLS/XLSX file', 'error');
        e.target.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        e.target.value = '';
        return;
      }

      setUploadForm({
        ...uploadForm,
        file,
        name: file.name.replace(/\.[^/.]+$/, ''),
      });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.file || !uploadForm.timelineId || !uploadForm.name) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('timelineId', uploadForm.timelineId);
      formData.append('name', uploadForm.name);

      const response = await fetch('/api/admin/documents/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        showToast('Document uploaded successfully!', 'success');
        setUploadForm({ file: null, timelineId: '', name: '' });
        // Reset file input
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchDocuments();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to upload document', 'error');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/documents/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showToast('Document deleted successfully!', 'success');
        setDeleteTarget(null);
        fetchDocuments();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete document', 'error');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <ToastContainer />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will permanently remove the file from storage. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Document Management</h1>
        <p className="text-gray-600">Upload and manage documents for the timeline</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-800">Upload Document</h2>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label htmlFor="timelineId" className="block text-sm font-medium text-gray-700 mb-2">
              Timeline Item
            </label>
            <select
              id="timelineId"
              required
              value={uploadForm.timelineId}
              onChange={(e) => setUploadForm({ ...uploadForm, timelineId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a timeline item</option>
              {timelineItems.map((item) => (
                <option key={item.id} value={item.id}>
                  Step {item.id}: {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Document Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={uploadForm.name}
              onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter document name"
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              File (PDF, DOC, DOCX, XLS, XLSX — Max 10MB)
            </label>
            <input
              id="file"
              type="file"
              required
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Document
              </>
            )}
          </button>
        </form>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Uploaded Documents</h2>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : documents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Timeline Item</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Upload Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Downloads</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-800">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{doc.timelineTitle}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(doc.uploadDate)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-gray-400" />
                        <span>{doc.downloadCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                          aria-label="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setDeleteTarget({ id: doc.id, name: doc.name })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          aria-label="Delete"
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
        )}
      </div>
    </div>
  );
}
