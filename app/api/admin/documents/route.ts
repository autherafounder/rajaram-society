import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const DOCUMENTS_FILE = path.join(process.cwd(), 'data', 'documents.json');

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    // Read documents data
    let documents = [];
    try {
      if (fs.existsSync(DOCUMENTS_FILE)) {
        const fileContent = fs.readFileSync(DOCUMENTS_FILE, 'utf-8');
        documents = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading documents file:', error);
      // Return empty array if file doesn't exist or is invalid
      documents = [];
    }

    return NextResponse.json(
      { documents },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Documents GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

