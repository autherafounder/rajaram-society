import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';

const DOCUMENTS_FILE = path.join(process.cwd(), 'data', 'documents.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const timelineItems: Record<number, string> = {
  1: 'Resolution of Redevelopment',
  2: 'PMC Invitation',
  3: 'PMC Tender Opening',
  4: 'Area Certificate Opening',
  5: 'Feasibility Report',
  6: 'Results of Bidders',
  7: 'Tender Award',
  8: 'Construction Commencement',
};

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

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
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
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
    const fileExtension = path.extname(file.name);
    const newFileName = `${sanitizedName}_${Date.now()}${fileExtension}`;
    
    // Create timeline-specific directory
    const timelineDir = path.join(UPLOAD_DIR, timelineId);
    if (!fs.existsSync(timelineDir)) {
      fs.mkdirSync(timelineDir, { recursive: true });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const finalPath = path.join(timelineDir, newFileName);
    await writeFile(finalPath, buffer);

    // Generate URL
    const url = `/uploads/${timelineId}/${newFileName}`;

    // Read existing documents
    let documents = [];
    try {
      if (fs.existsSync(DOCUMENTS_FILE)) {
        const fileContent = fs.readFileSync(DOCUMENTS_FILE, 'utf-8');
        documents = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading documents file:', error);
      documents = [];
    }

    // Add new document
    const newDocument = {
      id: Date.now().toString(),
      name: name,
      timelineId: parseInt(timelineId),
      timelineTitle: timelineItems[parseInt(timelineId)] || 'Unknown',
      url: url,
      uploadDate: new Date().toISOString(),
      size: file.size,
    };

    documents.push(newDocument);

    // Save documents
    try {
      fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(documents, null, 2));
    } catch (error) {
      console.error('Error saving documents file:', error);
      // Delete uploaded file if we can't save metadata
      try {
        fs.unlinkSync(finalPath);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
      return NextResponse.json(
        { error: 'Failed to save document metadata' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Document uploaded successfully',
        document: newDocument,
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
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

