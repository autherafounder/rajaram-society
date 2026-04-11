import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    // Read documents from Supabase
    const { data: documents, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return NextResponse.json({ documents: [] }, { status: 200 });
    }

    // Map DB fields to camelCase for frontend
    const mappedDocs = (documents || []).map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      timelineId: doc.timeline_id,
      timelineTitle: doc.timeline_title,
      url: doc.url,
      uploadDate: doc.upload_date,
      size: doc.size,
    }));

    return NextResponse.json({ documents: mappedDocs }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Documents GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
