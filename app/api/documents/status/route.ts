import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Disable Next.js route caching — status must always reflect current DB state
export const dynamic = 'force-dynamic';

// Returns document counts per timeline step
// Used by the public updates page to dynamically determine completed/pending status
export async function GET() {
  try {
    const { data: documents, error } = await supabaseAdmin
      .from('documents')
      .select('timeline_id');

    if (error) {
      console.error('Error fetching timeline status:', error);
      return NextResponse.json({ counts: {} }, { status: 200 });
    }

    // Count documents per timeline step
    const counts: Record<number, number> = {};
    (documents || []).forEach((doc: { timeline_id: number }) => {
      counts[doc.timeline_id] = (counts[doc.timeline_id] || 0) + 1;
    });

    return NextResponse.json(
      { counts },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Timeline status GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
