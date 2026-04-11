import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface AuditLogEntry {
  id: string;
  document_id: string;
  document_name: string;
  timeline_id: number;
  timeline_title: string;
  user_email: string | null;
  user_ip: string;
  blocked: boolean;
  created_at: string;
}

export interface BlockedUserEntry {
  id: string;
  identifier: string;
  type: 'email' | 'ip';
  reason: string;
  blocked_by: string;
  created_at: string;
}

export function getUserIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;

  return 'unknown';
}

export function getUserFromRequest(request: NextRequest): { email: string | null; ip: string } {
  const userCookie = request.cookies.get('userEmail');
  const userEmail = userCookie?.value || null;
  const userIP = getUserIP(request);

  return { email: userEmail, ip: userIP };
}

export async function isUserBlocked(identifier: string, type: 'email' | 'ip'): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blocked_users')
      .select('id')
      .eq('identifier', identifier)
      .eq('type', type)
      .limit(1);

    if (error) {
      console.error('Error checking blocked users:', error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  } catch (error) {
    console.error('Error checking blocked users:', error);
    return false;
  }
}

export async function logDownload(entry: {
  document_id: string;
  document_name: string;
  timeline_id: number;
  timeline_title: string;
  user_email: string | null;
  user_ip: string;
  blocked: boolean;
}): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from('audit_logs').insert({
      document_id: entry.document_id,
      document_name: entry.document_name,
      timeline_id: entry.timeline_id,
      timeline_title: entry.timeline_title,
      user_email: entry.user_email,
      user_ip: entry.user_ip,
      blocked: entry.blocked,
    });

    if (error) {
      console.error('Error logging download:', error);
    }
  } catch (error) {
    console.error('Error logging download:', error);
  }
}

export async function getAuditLogs(
  filters?: {
    documentId?: string;
    userEmail?: string;
    startDate?: string;
    endDate?: string;
  },
  limit?: number
): Promise<AuditLogEntry[]> {
  try {
    let query = supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.documentId) {
      query = query.eq('document_id', filters.documentId);
    }
    if (filters?.userEmail) {
      query = query.eq('user_email', filters.userEmail);
    }
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error reading audit logs:', error);
      return [];
    }

    return (data || []) as AuditLogEntry[];
  } catch (error) {
    console.error('Error reading audit logs:', error);
    return [];
  }
}

export async function getBlockedUsers(): Promise<BlockedUserEntry[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blocked_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error reading blocked users:', error);
      return [];
    }

    return (data || []) as BlockedUserEntry[];
  } catch (error) {
    console.error('Error reading blocked users:', error);
    return [];
  }
}

export async function blockUser(
  identifier: string,
  type: 'email' | 'ip',
  reason: string,
  blockedBy: string
): Promise<void> {
  try {
    // Check if already blocked
    const { data: existing } = await supabaseAdmin
      .from('blocked_users')
      .select('id')
      .eq('identifier', identifier)
      .eq('type', type)
      .limit(1);

    if (existing && existing.length > 0) {
      return; // Already blocked
    }

    const { error } = await supabaseAdmin.from('blocked_users').insert({
      identifier,
      type,
      reason,
      blocked_by: blockedBy,
    });

    if (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
}

export async function unblockUser(id: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('blocked_users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
}
