import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Lazy initialization to avoid errors during SSG build
let supabaseInstance: SupabaseClient<Database> | null = null;

export const getSupabase = (): SupabaseClient<Database> => {
    if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
        supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
            },
        });
    }

    if (!supabaseInstance) {
        // Return a dummy client that will be replaced at runtime
        // This allows the build to complete without errors
        return createClient<Database>(
            'https://placeholder.supabase.co',
            'placeholder-key',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );
    }

    return supabaseInstance;
};

// For backward compatibility - creates client lazily
export const supabase = new Proxy({} as SupabaseClient<Database>, {
    get(_, prop) {
        return (getSupabase() as any)[prop];
    },
});
