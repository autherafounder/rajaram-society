import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Skip Supabase middleware if environment variables are not set yet or are placeholders
    const isPlaceholder = (val?: string) => !val || val.includes('your_supabase_') || val === 'your-secret-key-change-in-production';

    if (isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL) || isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
        console.warn('Supabase environment variables not configured or using placeholders. Skipping auth middleware.');
        return res;
    }

    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if expired
    await supabase.auth.getSession();

    return res;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
