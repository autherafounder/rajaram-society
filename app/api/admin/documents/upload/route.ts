import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getTimelineTitle } from '@/data/timeline-items';
import crypto from 'crypto';

// Magic bytes for file type validation
const MAGIC_BYTES: Record<string, number[][]> = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'application/msword': [[0xD0, 0xCF, 0x11, 0xE0]], // OLE2 compound (DOC)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    [0x50, 0x4B, 0x03, 0x04], // PK (ZIP-based OOXML)
  ],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    [0x50, 0x4B, 0x03, 0x04], // PK (ZIP-based OOXML)
  ],
  'application/vnd.ms-excel': [[0xD0, 0xCF, 0x11, 0xE0]], // OLE2 compound (XLS)
};

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const expectedHeaders = MAGIC_BYTES[mimeType];
  if (!expectedHeaders) return false;

  return expectedHeaders.some((header) => {
    return header.every((byte, index) => buffer[index] === byte);
  });
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

    // Validate file type (MIME)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC/DOCX, and XLS/XLSX files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes (defense against MIME spoofing)
    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: 'File content does not match its declared type. Please upload a genuine document.' },
        { status: 400 }
      );
    }

    // Generate UUID filename for security
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const uuid = crypto.randomUUID();
    const storagePath = `timeline-${timelineId}/${uuid}.${fileExtension}`;

    // Upload to Supabase Storage
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

    const timelineTitle = getTimelineTitle(parseInt(timelineId));

    // Save document metadata to Supabase (no public URL stored)
    const { data: newDoc, error: dbError } = await supabaseAdmin
      .from('documents')
      .insert({
        name: name,
        timeline_id: parseInt(timelineId),
        timeline_title: timelineTitle,
        url: '', // No public URL — use signed URLs on fetch
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
      details: {
        documentId: newDoc.id,
        name,
        timelineId: parseInt(timelineId),
        fileType: file.type,
        fileSize: file.size,
      },
    });

    // Generate signed URL for immediate use
    const { data: signedUrlData } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(storagePath, 3600); // 1 hour

    return NextResponse.json(
      {
        message: 'Document uploaded successfully',
        document: {
          id: newDoc.id,
          name: newDoc.name,
          timelineId: newDoc.timeline_id,
          timelineTitle: newDoc.timeline_title,
          url: signedUrlData?.signedUrl || '',
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
