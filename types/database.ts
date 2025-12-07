export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            books: {
                Row: {
                    affiliate_links: Json | null
                    author: string
                    category: string
                    cover_url: string | null
                    created_at: string | null
                    created_by: string | null
                    description: string | null
                    id: string
                    is_digital_only: boolean | null
                    isbn: string | null
                    pages: number | null
                    pdf_url: string | null
                    price: number | null
                    status: string | null
                    subtitle: string | null
                    title: string
                    updated_at: string | null
                    year: number
                }
                Insert: {
                    affiliate_links?: Json | null
                    author: string
                    category: string
                    cover_url?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    is_digital_only?: boolean | null
                    isbn?: string | null
                    pages?: number | null
                    pdf_url?: string | null
                    price?: number | null
                    status?: string | null
                    subtitle?: string | null
                    title: string
                    updated_at?: string | null
                    year: number
                }
                Update: {
                    affiliate_links?: Json | null
                    author?: string
                    category?: string
                    cover_url?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    is_digital_only?: boolean | null
                    isbn?: string | null
                    pages?: number | null
                    pdf_url?: string | null
                    price?: number | null
                    status?: string | null
                    subtitle?: string | null
                    title: string
                    updated_at?: string | null
                    year: number
                }
                Relationships: [
                    {
                        foreignKeyName: "books_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            posts: {
                Row: {
                    author_id: string | null
                    category: string | null
                    content: string | null
                    cover_image: string | null
                    created_at: string | null
                    excerpt: string | null
                    id: string
                    published_at: string | null
                    slug: string
                    status: string | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    author_id?: string | null
                    category?: string | null
                    content?: string | null
                    cover_image?: string | null
                    created_at?: string | null
                    excerpt?: string | null
                    id?: string
                    published_at?: string | null
                    slug: string
                    status?: string | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    author_id?: string | null
                    category?: string | null
                    content?: string | null
                    cover_image?: string | null
                    created_at?: string | null
                    excerpt?: string | null
                    id?: string
                    published_at?: string | null
                    slug?: string
                    status?: string | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "posts_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    role: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    role?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    role?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
