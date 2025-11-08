import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const DOCUMENTS_FILE = path.join(process.cwd(), 'data', 'documents.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);

    const documentId = params.id;

    // Read documents
    let documents = [];
    try {
      if (fs.existsSync(DOCUMENTS_FILE)) {
        const fileContent = fs.readFileSync(DOCUMENTS_FILE, 'utf-8');
        documents = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading documents file:', error);
      return NextResponse.json(
        { error: 'Documents file not found or invalid' },
        { status: 404 }
      );
    }

    // Find document
    const documentIndex = documents.findIndex((doc: any) => doc.id === documentId);
    if (documentIndex === -1) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const document = documents[documentIndex];

    // Delete file from filesystem
    try {
      const filePath = path.join(process.cwd(), 'public', document.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue even if file deletion fails
    }

    // Remove from documents array
    documents.splice(documentIndex, 1);

    // Save updated documents
    try {
      fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(documents, null, 2));
    } catch (error) {
      console.error('Error saving documents file:', error);
      return NextResponse.json(
        { error: 'Failed to delete document metadata' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Document delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

