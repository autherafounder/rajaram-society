import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
    // Check if environment variables are available and not placeholders
    const isPlaceholder = (val?: string) => !val || val.includes('your_supabase_') || val === 'your-secret-key-change-in-production';

    if (isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL) || isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
        console.warn('Supabase environment variables not set or using placeholders');
        // Return a minimal client that won't crash during build
        return null as any;
    }
    return createClientComponentClient();
};

// Type definitions for database tables
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    role: 'user' | 'admin';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    role?: 'user' | 'admin';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    role?: 'user' | 'admin';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            documents: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    file_path: string;
                    file_type: string;
                    file_size: number;
                    is_public: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    file_path: string;
                    file_type: string;
                    file_size: number;
                    is_public?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    file_path?: string;
                    file_type?: string;
                    file_size?: number;
                    is_public?: boolean;
                    created_at?: string;
                };
            };
        };
    };
};
