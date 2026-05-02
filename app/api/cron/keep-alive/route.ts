import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Disable Next.js route caching for dynamic data
export const dynamic = 'force-dynamic';

// Keep-alive endpoint to prevent Supabase free-tier auto-pausing
// Supabase pauses projects after 7 days of inactivity
// This should be pinged every 5-6 days via an external cron service
//
// Free cron services:
//   - https://cron-job.org (recommended)
//   - https://uptimerobot.com
//   - Vercel Crons (if deployed on Vercel)
//
// Set schedule: every 5 days (e.g., "0 0 */5 * *")
// URL to ping: https://your-domain.vercel.app/api/cron/keep-alive

export async function GET() {
  try {
    // Simple lightweight query to keep the project active
    const { count, error } = await supabaseAdmin
      .from('admins')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Keep-alive ping failed:', error);
      return NextResponse.json(
        { status: 'error', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      dbConnected: true,
      adminCount: count,
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to ping database' },
      { status: 500 }
    );
  }
}
