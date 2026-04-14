import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateFeedback, sanitizeHtml } from '@/lib/validations/feedback';

// --- In-memory rate limiter ---
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 submissions per window

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  return forwarded?.split(',')[0]?.trim() || realIP || cfIP || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Remove expired timestamps
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, validTimestamps);

  if (validTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

// Periodic cleanup to prevent memory leaks (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitMap.entries());
  for (let i = 0; i < entries.length; i++) {
    const [ip, timestamps] = entries[i];
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, valid);
    }
  }
}, 10 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);

    // 1. Rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 2. Honeypot check — if the hidden 'website' field is filled, it's a bot
    if (body.website && body.website.trim() !== '') {
      // Silently return success to fool the bot
      return NextResponse.json(
        { message: 'Your feedback has been submitted successfully.' },
        { status: 200 }
      );
    }

    // 3. Map frontend field names to schema field names
    const mappedData = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      inquiry_type: body.inquiry || body.inquiry_type || '',
      message_type: body.messageType || body.message_type || 'suggestion',
      message: body.message,
      website: body.website || '',
    };

    // 4. Validate with Zod
    const validation = validateFeedback(mappedData);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.data!;

    // 5. Additional sanitization (defense in depth)
    const sanitizedData = {
      name: sanitizeHtml(data.name),
      phone: data.phone ? sanitizeHtml(data.phone) : null,
      email: data.email,
      inquiry_type: data.inquiry_type ? sanitizeHtml(data.inquiry_type) : null,
      message_type: data.message_type,
      message: sanitizeHtml(data.message),
      status: 'new',
    };

    // 6. Insert into Supabase
    const { data: feedback, error } = await supabaseAdmin
      .from('feedbacks')
      .insert(sanitizedData)
      .select('id, created_at')
      .single();

    if (error) {
      console.error('Error inserting feedback:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback. Please try again.' },
        { status: 500 }
      );
    }

    // 7. Log admin activity
    await supabaseAdmin.from('admin_activity').insert({
      admin_email: 'system',
      action: 'feedback_received',
      details: {
        feedbackId: feedback.id,
        email: sanitizedData.email,
        type: sanitizedData.message_type,
        ip: clientIP,
      },
    });

    return NextResponse.json(
      {
        message: 'Your feedback has been submitted successfully.',
        ticketId: `FB-${feedback.id.substring(0, 8).toUpperCase()}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
