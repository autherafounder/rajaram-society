import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { timelineId: string } }
) {
  try {
    const timelineId = parseInt(params.timelineId);

    if (isNaN(timelineId)) {
      return NextResponse.json(
        { error: 'Invalid timeline ID' },
        { status: 400 }
      );
    }

    // Fetch documents from Supabase
    const { data: documents, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('timeline_id', timelineId)
      .order('upload_date', { ascending: false });

    if (error) {
      console.error('Error fetching timeline documents:', error);
      return NextResponse.json({ documents: [] }, { status: 200 });
    }

    // Map to frontend format
    const mappedDocs = (documents || []).map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      timelineId: doc.timeline_id,
      timelineTitle: doc.timeline_title,
      url: doc.url,
      uploadDate: doc.upload_date,
      size: doc.size,
    }));

    return NextResponse.json(
      { documents: mappedDocs },
      { status: 200 }
    );
  } catch (error) {
    console.error('Timeline documents GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
