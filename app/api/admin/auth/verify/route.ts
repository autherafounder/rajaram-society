import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';

// Disable Next.js route caching for dynamic data
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminUser(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        user: admin,
        authenticated: true 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

