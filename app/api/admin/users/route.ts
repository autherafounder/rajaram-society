import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Disable Next.js route caching for dynamic data
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const logs = await getAuditLogs();
    const blockedUsers = await getBlockedUsers();

    // Aggregate user statistics
    const userStatsMap = new Map<
      string,
      {
        email: string;
        totalDownloads: number;
        lastDownloadAt: string | null;
      }
    >();

    logs.forEach((log) => {
      if (log.user_email) {
        if (!userStatsMap.has(log.user_email)) {
          userStatsMap.set(log.user_email, {
            email: log.user_email,
            totalDownloads: 0,
            lastDownloadAt: null,
          });
        }

        const stats = userStatsMap.get(log.user_email)!;
        stats.totalDownloads++;
        if (!stats.lastDownloadAt || log.created_at > stats.lastDownloadAt) {
          stats.lastDownloadAt = log.created_at;
        }
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

    users.sort((a, b) => b.totalDownloads - a.totalDownloads);

    // Map blocked users for frontend
    const mappedBlocked = blockedUsers.map((b) => ({
      id: b.id,
      identifier: b.identifier,
      type: b.type,
      reason: b.reason,
      blockedAt: b.created_at,
      blockedBy: b.blocked_by,
    }));

    return NextResponse.json(
      { users, blockedUsers: mappedBlocked },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Users GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

    await blockUser(identifier, type, reason, admin.email);

    return NextResponse.json(
      { message: 'User blocked successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Users POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
