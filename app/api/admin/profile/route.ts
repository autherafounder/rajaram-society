import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json');

export async function GET(request: NextRequest) {
  try {
    const admin = requireAdmin(request);

    // Read admin data
    let adminData;
    try {
      const fileContent = fs.readFileSync(ADMIN_FILE, 'utf-8');
      adminData = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading admin file:', error);
      return NextResponse.json(
        { error: 'Admin configuration not found' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        user: {
          email: adminData.email,
          name: adminData.name,
          role: adminData.role,
        },
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
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    const body = await request.json();
    const { name, email } = body;

    // Read current admin data
    let adminData;
    try {
      const fileContent = fs.readFileSync(ADMIN_FILE, 'utf-8');
      adminData = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading admin file:', error);
      return NextResponse.json(
        { error: 'Admin configuration not found' },
        { status: 500 }
      );
    }

    // Update admin data
    adminData.name = name || adminData.name;
    adminData.email = email || adminData.email;

    // Save updated data
    try {
      fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2));
    } catch (error) {
      console.error('Error writing admin file:', error);
      return NextResponse.json(
        { error: 'Failed to save profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          email: adminData.email,
          name: adminData.name,
          role: adminData.role,
        },
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
    console.error('Profile PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

