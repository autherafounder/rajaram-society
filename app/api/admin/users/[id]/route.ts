import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { unblockUser, getBlockedUsers, getAuditLogs } from '@/lib/download-tracking';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);

    unblockUser(params.id);

    return NextResponse.json(
      { message: 'User unblocked successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('User DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);

    // The id here is the blocked user ID or email
    const blockedUsers = getBlockedUsers();
    const blockedUser = blockedUsers.find((user) => user.id === params.id);

    if (!blockedUser) {
      // Try to find by identifier (email or IP)
      const userByIdentifier = blockedUsers.find((user) => user.identifier === params.id);
      if (userByIdentifier) {
        // Get download history for this user
        const logs = getAuditLogs({
          userEmail: userByIdentifier.type === 'email' ? userByIdentifier.identifier : undefined,
        });

        return NextResponse.json(
          {
            user: userByIdentifier,
            downloadHistory: logs,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get download history for this user
    const logs = getAuditLogs({
      userEmail: blockedUser.type === 'email' ? blockedUser.identifier : undefined,
    });

    return NextResponse.json(
      {
        user: blockedUser,
        downloadHistory: logs,
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
    console.error('User GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

