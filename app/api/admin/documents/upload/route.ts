import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getTimelineTitle } from '@/data/timeline-items';

export async function POST(request: NextRequest) {
  try {
    const admin = requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const timelineId = formData.get('timelineId') as string;
    const name = formData.get('name') as string;

    if (!file || !timelineId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOC/DOCX files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Sanitize filename
    const sanitizedName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileExtension = file.name.split('.').pop() || 'pdf';
    const storagePath = `timeline-${timelineId}/${sanitizedName}_${Date.now()}.${fileExtension}`;

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('documents')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;
    const timelineTitle = getTimelineTitle(parseInt(timelineId));

    // Save document metadata to Supabase
    const { data: newDoc, error: dbError } = await supabaseAdmin
      .from('documents')
      .insert({
        name: name,
        timeline_id: parseInt(timelineId),
        timeline_title: timelineTitle,
        url: publicUrl,
        file_path: storagePath,
        size: file.size,
        uploaded_by: admin.email,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Cleanup: delete uploaded file
      await supabaseAdmin.storage.from('documents').remove([storagePath]);
      return NextResponse.json(
        { error: 'Failed to save document metadata' },
        { status: 500 }
      );
    }

    // Log admin activity
    await supabaseAdmin.from('admin_activity').insert({
      admin_email: admin.email,
      action: 'document_upload',
      details: { documentId: newDoc.id, name, timelineId: parseInt(timelineId) },
    });

    return NextResponse.json(
      {
        message: 'Document uploaded successfully',
        document: {
          id: newDoc.id,
          name: newDoc.name,
          timelineId: newDoc.timeline_id,
          timelineTitle: newDoc.timeline_title,
          url: newDoc.url,
          uploadDate: newDoc.upload_date,
          size: newDoc.size,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
