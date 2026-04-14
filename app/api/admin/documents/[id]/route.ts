import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = requireAdmin(request);
    const documentId = params.id;

    // Find the document first
    const { data: document, error: findError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (findError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Step 1: Delete file from Supabase Storage FIRST
    // (If this fails, we still have the DB record pointing to it)
    if (document.file_path) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Log the orphan risk but continue with DB deletion
        // The file might already be deleted or the path might be wrong
      }
    }

    // Step 2: Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (deleteError) {
      console.error('Error deleting document record:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      );
    }

    // Step 3: Log admin activity
    await supabaseAdmin.from('admin_activity').insert({
      admin_email: admin.email,
      action: 'document_delete',
      details: {
        documentId,
        name: document.name,
        filePath: document.file_path,
        timelineId: document.timeline_id,
      },
    });

    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Document delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
