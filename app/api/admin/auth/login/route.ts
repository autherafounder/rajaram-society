import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_FILE = path.join(process.cwd(), 'data', 'admin.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Read admin data from file
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
        { error: 'Admin configuration not found or invalid' },
        { status: 500 }
      );
    }

    // Check email
    if (adminData.email !== email) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminData.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: adminData.email,
        role: adminData.role,
        name: adminData.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          email: adminData.email,
          name: adminData.name,
          role: adminData.role,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

