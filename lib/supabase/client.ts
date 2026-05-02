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
            feedbacks: {
                Row: {
                    id: string;
                    name: string;
                    phone: string | null;
                    email: string;
                    inquiry_type: string | null;
                    message_type: 'suggestion' | 'inquiry';
                    message: string;
                    created_at: string;
                    status: 'new' | 'read' | 'resolved';
                };
                Insert: {
                    id?: string;
                    name: string;
                    phone?: string | null;
                    email: string;
                    inquiry_type?: string | null;
                    message_type: 'suggestion' | 'inquiry';
                    message: string;
                    created_at?: string;
                    status?: 'new' | 'read' | 'resolved';
                };
                Update: {
                    id?: string;
                    name?: string;
                    phone?: string | null;
                    email?: string;
                    inquiry_type?: string | null;
                    message_type?: 'suggestion' | 'inquiry';
                    message?: string;
                    created_at?: string;
                    status?: 'new' | 'read' | 'resolved';
                };
            };
            documents: {
                Row: {
                    id: string;
                    name: string;
                    timeline_id: number;
                    timeline_title: string;
                    url: string;
                    file_path: string | null;
                    upload_date: string;
                    size: number;
                    uploaded_by: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    timeline_id: number;
                    timeline_title: string;
                    url?: string;
                    file_path?: string | null;
                    upload_date?: string;
                    size?: number;
                    uploaded_by?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    timeline_id?: number;
                    timeline_title?: string;
                    url?: string;
                    file_path?: string | null;
                    upload_date?: string;
                    size?: number;
                    uploaded_by?: string | null;
                    created_at?: string;
                };
            };
        };
    };
};
