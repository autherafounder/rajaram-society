import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAuditLogs, getBlockedUsers, blockUser, unblockUser } from '@/lib/download-tracking';

export async function GET(request: NextRequest) {
  try {
    const admin = requireAdmin(request);

    // Get all audit logs to extract user information
    const logs = getAuditLogs();
    const blockedUsers = getBlockedUsers();

    // Aggregate user statistics
    const userStatsMap = new Map<string, {
      email: string;
      totalDownloads: number;
      lastDownloadAt: string | null;
      documentDownloads: Map<string, number>;
    }>();

    logs.forEach((log) => {
      if (log.userEmail) {
        if (!userStatsMap.has(log.userEmail)) {
          userStatsMap.set(log.userEmail, {
            email: log.userEmail,
            totalDownloads: 0,
            lastDownloadAt: null,
            documentDownloads: new Map(),
          });
        }

        const stats = userStatsMap.get(log.userEmail)!;
        stats.totalDownloads++;
        if (!stats.lastDownloadAt || log.timestamp > stats.lastDownloadAt) {
          stats.lastDownloadAt = log.timestamp;
        }
        
        const docCount = stats.documentDownloads.get(log.documentId) || 0;
        stats.documentDownloads.set(log.documentId, docCount + 1);
      }
    });

    // Convert to array and check blocked status
    const users = Array.from(userStatsMap.values()).map((stats) => {
      const isBlocked = blockedUsers.some(
        (blocked) => blocked.identifier === stats.email && blocked.type === 'email'
      );

      return {
        email: stats.email,
        totalDownloads: stats.totalDownloads,
        lastDownloadAt: stats.lastDownloadAt,
        isBlocked,
      };
    });

    // Sort by total downloads descending
    users.sort((a, b) => b.totalDownloads - a.totalDownloads);

    return NextResponse.json(
      { users, blockedUsers },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Users GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    const body = await request.json();
    const { identifier, type, reason } = body;

    if (!identifier || !type || !reason) {
      return NextResponse.json(
        { error: 'identifier, type, and reason are required' },
        { status: 400 }
      );
    }

    if (type !== 'email' && type !== 'ip') {
      return NextResponse.json(
        { error: 'type must be "email" or "ip"' },
        { status: 400 }
      );
    }

    blockUser(identifier, type, reason, admin.email);

    return NextResponse.json(
      { message: 'User blocked successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Users POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

