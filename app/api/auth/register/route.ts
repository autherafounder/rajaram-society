import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, validatePassword } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, fullName } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                { error: passwordValidation.errors[0] },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Sign up the user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || email.split('@')[0],
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8787'}/auth/callback`,
            },
        });

        if (error) {
            console.error('Signup error:', error);
            return NextResponse.json(
                { error: error.message || 'Failed to create account' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: 'Account created successfully. Please check your email to confirm your account.',
                user: {
                    id: data.user?.id,
                    email: data.user?.email,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
