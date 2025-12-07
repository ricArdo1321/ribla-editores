-- ============================================================================
-- POSTS TABLE SCHEMA
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- ============================================================================

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    author_id UUID REFERENCES public.profiles(id),
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies for posts table

-- Anyone can view published posts
CREATE POLICY "Anyone can view published posts"
    ON public.posts
    FOR SELECT
    USING (status = 'published');

-- Authors can view all their own posts
CREATE POLICY "Authors can view own posts"
    ON public.posts
    FOR SELECT
    USING (auth.uid() = author_id);

-- Admins can view all posts
CREATE POLICY "Admins can view all posts"
    ON public.posts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

-- Authors can insert their own posts
CREATE POLICY "Authors can create posts"
    ON public.posts
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts"
    ON public.posts
    FOR UPDATE
    USING (auth.uid() = author_id);

-- Admins can update any post
CREATE POLICY "Admins can update any post"
    ON public.posts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

-- Authors can delete their own draft posts
CREATE POLICY "Authors can delete own draft posts"
    ON public.posts
    FOR DELETE
    USING (
        auth.uid() = author_id 
        AND status = 'draft'
    );

-- Admins can delete any post
CREATE POLICY "Admins can delete any post"
    ON public.posts
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.posts TO anon;
GRANT ALL ON public.posts TO authenticated;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
