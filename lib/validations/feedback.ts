import { z } from 'zod';

// --- Sanitization Utilities ---

/**
 * Strip all HTML tags and dangerous patterns from input
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove inline event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim();
}

/**
 * Deep sanitize all string fields in an object
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeHtml(sanitized[key] as string);
    }
  }
  return sanitized;
}

// --- Zod Schemas ---

export const INQUIRY_TYPES = [
  'status-update',
  'approval',
  'grievance',
  'general',
  'other',
] as const;

export const MESSAGE_TYPES = ['suggestion', 'inquiry'] as const;

export const FeedbackSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform(sanitizeHtml),
  phone: z
    .string()
    .optional()
    .transform((val) => val?.trim() || '')
    .pipe(
      z.string().refine(
        (val) => {
          if (!val) return true; // Optional field
          const digitsOnly = val.replace(/\D/g, '');
          return digitsOnly.length >= 10 && /^[\d\s\-\+\(\)]+$/.test(val);
        },
        { message: 'Please enter a valid phone number (at least 10 digits)' }
      )
    ),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254, 'Email is too long')
    .transform((val) => val.toLowerCase().trim()),
  inquiry_type: z
    .string()
    .optional()
    .transform((val) => val?.trim() || ''),
  message_type: z.enum(MESSAGE_TYPES, {
    message: 'Message type must be suggestion or inquiry',
  }),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .transform(sanitizeHtml),
  // Honeypot field — should always be empty
  website: z
    .string()
    .optional()
    .transform((val) => val?.trim() || ''),
});

export type FeedbackInput = z.infer<typeof FeedbackSchema>;

/**
 * Validate feedback input and return typed result
 */
export function validateFeedback(data: unknown): {
  success: boolean;
  data?: FeedbackInput;
  errors?: Record<string, string>;
} {
  const result = FeedbackSchema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0]?.toString() || 'unknown';
      errors[field] = issue.message;
    }
    return { success: false, errors };
  }

  return { success: true, data: result.data };
}
