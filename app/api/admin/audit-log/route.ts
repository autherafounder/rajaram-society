import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAuditLogs } from '@/lib/download-tracking';

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

    const logs = getAuditLogs(
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
    const uniqueUsers = new Set(logs.filter((log) => log.userEmail).map((log) => log.userEmail)).size;
    const blockedAttempts = logs.filter((log) => log.blocked).length;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const downloadsToday = logs.filter(
      (log) => new Date(log.timestamp) >= today
    ).length;
    const downloadsThisWeek = logs.filter(
      (log) => new Date(log.timestamp) >= weekAgo
    ).length;
    const downloadsThisMonth = logs.filter(
      (log) => new Date(log.timestamp) >= monthAgo
    ).length;

    return NextResponse.json(
      {
        logs,
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Audit log GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

