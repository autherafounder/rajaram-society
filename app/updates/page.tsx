'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle2, Download, FileText, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface TimelineItem {
  id: number;
  step: number;
  title: string;
  description: string;
  completed: boolean;
  detailDescription?: string;
  downloadLinks?: Array<{
    name: string;
    url: string;
  }>;
}

const timelineItems: TimelineItem[] = [
  {
    id: 1,
    step: 1,
    title: 'Resolution of redevelopment',
    description: 'Society resolution passed for redevelopment.',
    completed: true,
    downloadLinks: [{ name: 'Minutes of Meeting', url: '/docs/1. Minutes of Meeting for Resolution of Redevelopment.pdf' }]
  },
  {
    id: 2,
    step: 2,
    title: 'PMC Invitation',
    description: 'Invitation issued to Project Management Consultants (PMC).',
    completed: true,
    downloadLinks: [{ name: 'PMC Invitation', url: '/docs/2. PMC Invitation.pdf' }]
  },
  {
    id: 3,
    step: 3,
    title: 'PMC Tender Opening',
    description: 'PMC tenders opened and recorded.',
    completed: true,
    downloadLinks: [{ name: 'PMC Tender Opening', url: '/docs/3. PMC Tender Opening.pdf' }]
  },
  {
    id: 4,
    step: 4,
    title: 'PMC Appointment',
    description: 'PMC appointed to manage the project.',
    completed: true,
    downloadLinks: [{ name: 'PMC Appointment', url: '/docs/4. PMC Appointment.pdf' }]
  },
  {
    id: 5,
    step: 5,
    title: 'Area Certification',
    description: 'Certified area details obtained for planning.',
    completed: true,
    downloadLinks: [{ name: 'Area Certificate', url: '/docs/5. Area Certificate.pdf' }]
  },
  { id: 6, step: 6, title: 'Feasibility Report', description: 'Feasibility study prepared by PMC.', completed: false },
  { id: 7, step: 7, title: 'Draft Tender Inviting Developer', description: 'Draft tender prepared to invite developers.', completed: false },
  { id: 8, step: 8, title: 'Final Tender for Inviting Developer', description: 'Final tender released inviting developers.', completed: false },
  { id: 9, step: 9, title: 'Developer Tender Opening', description: 'Developer tenders opened for evaluation.', completed: false },
  { id: 10, step: 10, title: 'Developer Appointment/ 79A Order', description: 'Developer appointed as per 79A guidelines.', completed: false },
  { id: 11, step: 11, title: 'Development Agreement', description: 'Development Agreement executed with the developer.', completed: false },
  { id: 12, step: 12, title: 'CC Documentation', description: 'Commencement Certificate (CC) documentation submitted.', completed: false },
  { id: 13, step: 13, title: 'Approved CC', description: 'Commencement Certificate approved.', completed: false },
  { id: 14, step: 14, title: 'RERA Registration Certificate', description: 'RERA registration completed and certificate issued.', completed: false },
  { id: 15, step: 15, title: 'Construction', description: 'Construction activities in progress.', completed: false },
  { id: 16, step: 16, title: 'OC Documentation', description: 'Occupancy Certificate documentation prepared.', completed: false },
  { id: 17, step: 17, title: 'Occupancy Certificate (OC)', description: 'OC received from competent authority.', completed: false },
  { id: 18, step: 18, title: 'Possession/ Handover', description: 'Possession and handover to members.', completed: false },
  { id: 19, step: 19, title: 'Taxation', description: 'Applicable taxation formalities completed.', completed: false },
];

interface UploadedDocument {
  id: string;
  name: string;
  timelineId: number;
  timelineTitle: string;
  url: string;
  uploadDate: string;
  size?: number;
}

export default function UpdatesPage() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<number, UploadedDocument[]>>({});
  const [loadingDocuments, setLoadingDocuments] = useState<Record<number, boolean>>({});

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        // Fetch documents when expanding
        if (!uploadedDocuments[id] && !loadingDocuments[id]) {
          fetchTimelineDocuments(id);
        }
      }
      return newSet;
    });
  };

  const fetchTimelineDocuments = async (timelineId: number) => {
    setLoadingDocuments((prev) => ({ ...prev, [timelineId]: true }));
    try {
      const response = await fetch(`/api/documents/timeline/${timelineId}`);
      if (response.ok) {
        const data = await response.json();
        setUploadedDocuments((prev) => ({
          ...prev,
          [timelineId]: data.documents || [],
        }));
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingDocuments((prev) => ({ ...prev, [timelineId]: false }));
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Redevelopment Project Timeline
            </h1>
            <div className="mt-4">
              <a
                href="/documents"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                <FileText className="w-4 h-4" />
                Know More (Documents PDF)
              </a>
            </div>
            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                <span className="text-sm font-medium text-gray-700">Pending</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

              {/* Timeline Items */}
              <div>
                {timelineItems.map((item, index) => {
                  const isExpanded = expandedItems.has(item.id);
                  return (
                    <div key={item.id} className="relative flex gap-6">
                      {/* Step Number & Status Node */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${item.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                            } z-10`}
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-8 h-8" />
                          ) : (
                            item.step
                          )}
                        </div>
                        {index < timelineItems.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 ${item.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            style={{ minHeight: '40px' }}
                          ></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {item.title}
                              </h3>
                              <p className="text-gray-600">{item.description}</p>
                            </div>
                            <button
                              onClick={() => toggleItem(item.id)}
                              className="ml-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                              aria-label={isExpanded ? 'Close details' : 'Read more'}
                            >
                              Read More
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                              {/* Detail Description */}
                              {item.detailDescription && (
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                  {item.detailDescription}
                                </p>
                              )}

                              {/* Download Documents */}
                              <div className="mt-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Download className="w-5 h-5 text-primary" />
                                  <span className="font-semibold text-gray-800">
                                    Download Documents
                                  </span>
                                </div>

                                {/* Note: Static links are not tracked. Only admin-uploaded documents are tracked. */}

                                {item.downloadLinks && item.downloadLinks.length > 0 && (
                                  <div className="space-y-2 mb-4">
                                    {item.downloadLinks.map((link, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                                      >
                                        <FileText className="w-5 h-5 text-blue-600 group-hover:text-primary transition-colors flex-shrink-0" />
                                        <div className="flex-1">
                                          <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-700 group-hover:text-primary transition-colors font-medium block"
                                          >
                                            {link.name}
                                          </a>
                                        </div>
                                        <a
                                          href={link.url}
                                          download
                                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                                          aria-label="Download"
                                        >
                                          <Download className="w-4 h-4" />
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Show uploaded documents from admin */}
                                {loadingDocuments[item.id] ? (
                                  <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                  </div>
                                ) : uploadedDocuments[item.id] && uploadedDocuments[item.id].length > 0 ? (
                                  <div className="space-y-2">
                                    {uploadedDocuments[item.id].map((doc) => (
                                      <div
                                        key={doc.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                                      >
                                        <FileText className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors flex-shrink-0" />
                                        <div className="flex-1">
                                          <a
                                            href={`/api/documents/download?id=${doc.id}`}
                                            className="text-gray-700 group-hover:text-primary transition-colors font-medium block"
                                          >
                                            {doc.name}
                                          </a>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Uploaded on {formatDate(doc.uploadDate)}
                                          </p>
                                        </div>
                                        <a
                                          href={`/api/documents/download?id=${doc.id}`}
                                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                                          aria-label="Download"
                                        >
                                          <Download className="w-4 h-4" />
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                ) : (!item.downloadLinks || item.downloadLinks.length === 0) ? (
                                  <p className="text-sm text-gray-500 italic">No documents available for this stage yet.</p>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

