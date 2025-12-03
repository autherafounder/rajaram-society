import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createServerClient();

        // Exchange the code for a session
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to home page after confirmation
    return NextResponse.redirect(new URL('/?confirmed=true', request.url));
}
