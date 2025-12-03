import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
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
