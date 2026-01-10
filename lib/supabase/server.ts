import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from './client';

export const createServerClient = () => {
    // Check if environment variables are available and not placeholders
    const isPlaceholder = (val?: string) => !val || val.includes('your_supabase_') || val === 'your-secret-key-change-in-production';

    if (isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL) || isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
        console.warn('Supabase environment variables not set or using placeholders');
        // Return a minimal client that won't crash during build
        return null as any;
    }

    const cookieStore = cookies();
    return createServerComponentClient<Database>({ cookies: () => cookieStore });
};

// Helper function to get the current user
export async function getCurrentUser() {
    const supabase = createServerClient();
    if (!supabase) return null;

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

// Helper function to get user profile including role
export async function getUserProfile(userId: string) {
    const supabase = createServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return data;
}

// Helper function to check if user is admin
export async function isAdmin() {
    const user = await getCurrentUser();
    if (!user) return false;

    const profile = await getUserProfile(user.id);
    return profile?.role === 'admin';
}
