import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAuditLogs } from '@/lib/download-tracking';

// Disable Next.js route caching for dynamic data
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');
    const userEmail = searchParams.get('userEmail');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const logs = await getAuditLogs(
      {
        documentId: documentId || undefined,
        userEmail: userEmail || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
      limit
    );

    // Calculate statistics
    const totalDownloads = logs.length;
    const uniqueUsers = new Set(
      logs.filter((log) => log.user_email).map((log) => log.user_email)
    ).size;
    const blockedAttempts = logs.filter((log) => log.blocked).length;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const downloadsToday = logs.filter(
      (log) => new Date(log.created_at) >= today
    ).length;
    const downloadsThisWeek = logs.filter(
      (log) => new Date(log.created_at) >= weekAgo
    ).length;
    const downloadsThisMonth = logs.filter(
      (log) => new Date(log.created_at) >= monthAgo
    ).length;

    // Map to frontend-expected format
    const mappedLogs = logs.map((log) => ({
      id: log.id,
      documentId: log.document_id,
      documentName: log.document_name,
      timelineId: log.timeline_id,
      timelineTitle: log.timeline_title,
      userEmail: log.user_email,
      userIP: log.user_ip,
      timestamp: log.created_at,
      blocked: log.blocked,
    }));

    return NextResponse.json(
      {
        logs: mappedLogs,
        statistics: {
          totalDownloads,
          uniqueUsers,
          blockedAttempts,
          downloadsToday,
          downloadsThisWeek,
          downloadsThisMonth,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Audit log GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
