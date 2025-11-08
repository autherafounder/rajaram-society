import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const AUDIT_LOG_FILE = path.join(process.cwd(), 'data', 'audit-log.json');
const BLOCKED_USERS_FILE = path.join(process.cwd(), 'data', 'blocked-users.json');

export interface AuditLogEntry {
  id: string;
  documentId: string;
  documentName: string;
  timelineId: number;
  timelineTitle: string;
  userEmail: string | null;
  userIP: string;
  timestamp: string;
  blocked: boolean;
}

export interface BlockedUserEntry {
  id: string;
  identifier: string; // email or IP
  type: 'email' | 'ip';
  reason: string;
  blockedAt: string;
  blockedBy: string; // admin email
}

export function getUserIP(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

export function getUserFromRequest(request: NextRequest): { email: string | null; ip: string } {
  // Try to get user email from cookies/session
  // For now, we'll use a cookie if available, otherwise IP
  const userCookie = request.cookies.get('userEmail');
  const userEmail = userCookie?.value || null;
  const userIP = getUserIP(request);
  
  return { email: userEmail, ip: userIP };
}

export function isUserBlocked(identifier: string, type: 'email' | 'ip'): boolean {
  try {
    if (!fs.existsSync(BLOCKED_USERS_FILE)) {
      return false;
    }
    
    const fileContent = fs.readFileSync(BLOCKED_USERS_FILE, 'utf-8');
    const blockedUsers: BlockedUserEntry[] = JSON.parse(fileContent);
    
    return blockedUsers.some(
      (blocked) => blocked.identifier === identifier && blocked.type === type
    );
  } catch (error) {
    console.error('Error checking blocked users:', error);
    return false;
  }
}

export function logDownload(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  try {
    let logs: AuditLogEntry[] = [];
    
    if (fs.existsSync(AUDIT_LOG_FILE)) {
      const fileContent = fs.readFileSync(AUDIT_LOG_FILE, 'utf-8');
      logs = JSON.parse(fileContent);
    }
    
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    
    logs.push(newEntry);
    
    // Keep only last 10,000 entries to prevent file from growing too large
    if (logs.length > 10000) {
      logs = logs.slice(-10000);
    }
    
    fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Error logging download:', error);
  }
}

export function getAuditLogs(
  filters?: {
    documentId?: string;
    userEmail?: string;
    startDate?: string;
    endDate?: string;
  },
  limit?: number
): AuditLogEntry[] {
  try {
    if (!fs.existsSync(AUDIT_LOG_FILE)) {
      return [];
    }
    
    const fileContent = fs.readFileSync(AUDIT_LOG_FILE, 'utf-8');
    let logs: AuditLogEntry[] = JSON.parse(fileContent);
    
    // Apply filters
    if (filters) {
      if (filters.documentId) {
        logs = logs.filter((log) => log.documentId === filters.documentId);
      }
      if (filters.userEmail) {
        logs = logs.filter((log) => log.userEmail === filters.userEmail);
      }
      if (filters.startDate) {
        logs = logs.filter((log) => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter((log) => log.timestamp <= filters.endDate!);
      }
    }
    
    // Sort by timestamp descending (newest first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Apply limit
    if (limit) {
      logs = logs.slice(0, limit);
    }
    
    return logs;
  } catch (error) {
    console.error('Error reading audit logs:', error);
    return [];
  }
}

export function getBlockedUsers(): BlockedUserEntry[] {
  try {
    if (!fs.existsSync(BLOCKED_USERS_FILE)) {
      return [];
    }
    
    const fileContent = fs.readFileSync(BLOCKED_USERS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading blocked users:', error);
    return [];
  }
}

export function blockUser(
  identifier: string,
  type: 'email' | 'ip',
  reason: string,
  blockedBy: string
): void {
  try {
    let blockedUsers: BlockedUserEntry[] = [];
    
    if (fs.existsSync(BLOCKED_USERS_FILE)) {
      const fileContent = fs.readFileSync(BLOCKED_USERS_FILE, 'utf-8');
      blockedUsers = JSON.parse(fileContent);
    }
    
    // Check if already blocked
    const existing = blockedUsers.find(
      (user) => user.identifier === identifier && user.type === type
    );
    
    if (existing) {
      return; // Already blocked
    }
    
    const newEntry: BlockedUserEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      identifier,
      type,
      reason,
      blockedAt: new Date().toISOString(),
      blockedBy,
    };
    
    blockedUsers.push(newEntry);
    fs.writeFileSync(BLOCKED_USERS_FILE, JSON.stringify(blockedUsers, null, 2));
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
}

export function unblockUser(id: string): void {
  try {
    if (!fs.existsSync(BLOCKED_USERS_FILE)) {
      return;
    }
    
    const fileContent = fs.readFileSync(BLOCKED_USERS_FILE, 'utf-8');
    let blockedUsers: BlockedUserEntry[] = JSON.parse(fileContent);
    
    blockedUsers = blockedUsers.filter((user) => user.id !== id);
    fs.writeFileSync(BLOCKED_USERS_FILE, JSON.stringify(blockedUsers, null, 2));
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
}

