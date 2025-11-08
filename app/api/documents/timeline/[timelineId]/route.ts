import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DOCUMENTS_FILE = path.join(process.cwd(), 'data', 'documents.json');

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

    // Read documents
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

    // Filter documents for this timeline item
    const timelineDocuments = documents.filter(
      (doc: any) => doc.timelineId === timelineId
    );

    // Sort by upload date (newest first)
    timelineDocuments.sort((a: any, b: any) => {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    });

    return NextResponse.json(
      { documents: timelineDocuments },
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

