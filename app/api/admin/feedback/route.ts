import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseAdmin
      .from('feedbacks')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    query = query.range(offset, offset + limit - 1);

    const { data: feedbacks, error, count } = await query;

    if (error) {
      console.error('Error fetching feedbacks:', error);
      return NextResponse.json({ feedbacks: [], total: 0 }, { status: 200 });
    }

    // Get stats
    const { data: allFeedbacks } = await supabaseAdmin
      .from('feedbacks')
      .select('status');

    const stats = {
      total: allFeedbacks?.length || 0,
      new: allFeedbacks?.filter((f) => f.status === 'new').length || 0,
      read: allFeedbacks?.filter((f) => f.status === 'read').length || 0,
      resolved: allFeedbacks?.filter((f) => f.status === 'resolved').length || 0,
    };

    return NextResponse.json(
      {
        feedbacks: feedbacks || [],
        total: count || 0,
        page,
        limit,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Feedback GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
