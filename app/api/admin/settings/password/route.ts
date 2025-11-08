import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json');

export async function PUT(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Read admin data
    let adminData;
    try {
      if (!fs.existsSync(ADMIN_FILE)) {
        return NextResponse.json(
          { error: 'Admin configuration file not found' },
          { status: 500 }
        );
      }
      const fileContent = fs.readFileSync(ADMIN_FILE, 'utf-8');
      adminData = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading admin file:', error);
      return NextResponse.json(
        { error: 'Admin configuration not found' },
        { status: 500 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, adminData.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    adminData.password = hashedPassword;

    // Save updated data
    try {
      fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2));
    } catch (error) {
      console.error('Error writing admin file:', error);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

