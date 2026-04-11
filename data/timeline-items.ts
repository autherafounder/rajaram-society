// Shared timeline items — single source of truth
// Used by: updates page, admin documents page, upload API route

export interface TimelineItemData {
  id: number;
  title: string;
}

export const timelineItems: TimelineItemData[] = [
  { id: 1, title: 'Resolution of Redevelopment' },
  { id: 2, title: 'PMC Invitation' },
  { id: 3, title: 'PMC Tender Opening' },
  { id: 4, title: 'PMC Appointment' },
  { id: 5, title: 'Area Certification' },
  { id: 6, title: 'Feasibility Report' },
  { id: 7, title: 'Draft Tender Inviting Developer' },
  { id: 8, title: 'Final Tender for Inviting Developer' },
  { id: 9, title: 'Developer Tender Opening' },
  { id: 10, title: 'Developer Appointment / 79A Order' },
  { id: 11, title: 'Development Agreement' },
  { id: 12, title: 'CC Documentation' },
  { id: 13, title: 'Approved CC' },
  { id: 14, title: 'RERA Registration Certificate' },
  { id: 15, title: 'Construction' },
  { id: 16, title: 'OC Documentation' },
  { id: 17, title: 'Occupancy Certificate (OC)' },
  { id: 18, title: 'Possession / Handover' },
  { id: 19, title: 'Taxation' },
];

export const getTimelineTitle = (id: number): string => {
  return timelineItems.find((item) => item.id === id)?.title || 'Unknown';
};
