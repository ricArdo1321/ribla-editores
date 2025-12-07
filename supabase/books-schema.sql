-- ============================================================================
-- BOOKS TABLE SCHEMA
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql
-- ============================================================================

-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    author TEXT NOT NULL,
    year INTEGER NOT NULL,
    isbn TEXT,
    pages INTEGER,
    category TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    is_digital_only BOOLEAN DEFAULT false,
    cover_url TEXT,
    pdf_url TEXT,
    affiliate_links JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Policies for books table
-- Anyone can view published books
CREATE POLICY "Anyone can view published books"
    ON public.books
    FOR SELECT
    USING (status = 'published');

-- Admins can view all books
CREATE POLICY "Admins can view all books"
    ON public.books
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

-- Admins can insert books
CREATE POLICY "Admins can insert books"
    ON public.books
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

-- Admins can update books
CREATE POLICY "Admins can update books"
    ON public.books
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

-- Only global admin can delete books
CREATE POLICY "Global admin can delete books"
    ON public.books
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role = 'GLOBAL_ADMIN'
        )
    );

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_books_updated_at ON public.books;
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.books TO anon;
GRANT ALL ON public.books TO authenticated;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);
CREATE INDEX IF NOT EXISTS idx_books_created_by ON public.books(created_by);

-- ============================================================================
-- STORAGE BUCKETS
-- Run these commands in Supabase Dashboard > Storage > Create new bucket
-- Or run this SQL:
-- ============================================================================

-- Create storage bucket for book covers (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for PDFs (private - only authenticated users)
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-pdfs', 'book-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for book-covers bucket (public read, admin write)
CREATE POLICY "Anyone can view book covers"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'book-covers');

CREATE POLICY "Admins can upload book covers"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'book-covers'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

CREATE POLICY "Admins can update book covers"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'book-covers'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

CREATE POLICY "Admins can delete book covers"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'book-covers'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

-- Storage policies for book-pdfs bucket (authenticated read, admin write)
CREATE POLICY "Authenticated users can view book PDFs"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'book-pdfs' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can upload book PDFs"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'book-pdfs'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

CREATE POLICY "Admins can update book PDFs"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'book-pdfs'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );

CREATE POLICY "Admins can delete book PDFs"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'book-pdfs'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );
