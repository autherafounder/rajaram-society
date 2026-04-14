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

    // --- CSRF Protection for mutating requests ---
    const method = req.method.toUpperCase();
    const mutateMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

    if (mutateMethods.includes(method)) {
        const origin = req.headers.get('origin');
        const referer = req.headers.get('referer');
        const host = req.headers.get('host');

        // Allow requests without origin/referer (e.g., server-side fetches, curl)
        // But if they exist, validate them
        if (origin || referer) {
            const requestOrigin = origin || (referer ? new URL(referer).origin : null);
            const expectedOrigins = [
                `https://${host}`,
                `http://${host}`,
                // Allow localhost for development
                'http://localhost:3000',
                'http://127.0.0.1:3000',
            ];

            if (requestOrigin && !expectedOrigins.some((eo) => requestOrigin.startsWith(eo))) {
                console.warn(`CSRF: Rejected request from origin ${requestOrigin}`);
                return NextResponse.json(
                    { error: 'CSRF validation failed' },
                    { status: 403 }
                );
            }
        }
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
