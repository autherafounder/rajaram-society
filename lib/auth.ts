import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('CRITICAL: JWT_SECRET environment variable is not set!');
}

export interface AdminUser {
  email: string;
  role: string;
  name: string;
}

export function getAdminUser(request: NextRequest): AdminUser | null {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET not configured');
    return null;
  }

  try {
    // Try to get token from cookie first
    const token = request.cookies.get('adminToken')?.value;

    // If no cookie, try Authorization header
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    const adminToken = token || headerToken;

    if (!adminToken) {
      return null;
    }

    // Verify token with explicit options
    try {
      const decoded = jwt.verify(adminToken, JWT_SECRET, {
        algorithms: ['HS256'],
        maxAge: '7d', // Must match expiresIn in login route
      }) as jwt.JwtPayload & AdminUser;

      // Validate required fields exist
      if (!decoded.email || !decoded.role) {
        console.error('JWT missing required fields (email/role)');
        return null;
      }

      // Validate role is admin
      if (decoded.role !== 'admin') {
        console.error(`JWT role mismatch: expected 'admin', got '${decoded.role}'`);
        return null;
      }

      return {
        email: decoded.email,
        role: decoded.role,
        name: decoded.name || 'Admin',
      };
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        console.warn('JWT token expired');
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        console.warn('JWT verification failed:', jwtError.message);
      } else {
        console.error('JWT verification error:', jwtError);
      }
      return null;
    }
  } catch (error) {
    console.error('Error in getAdminUser:', error);
    return null;
  }
}

export function requireAdmin(request: NextRequest): AdminUser {
  const admin = getAdminUser(request);

  if (!admin) {
    throw new Error('Unauthorized');
  }

  return admin;
}
