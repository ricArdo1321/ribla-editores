-- ============================================================================
-- POST IMAGES STORAGE BUCKET
-- Run this in Supabase SQL Editor to create the storage bucket for post images
-- ============================================================================

-- Create storage bucket for post images (public - anyone can view published posts)
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for post-images bucket

-- Anyone can view post images (public bucket)
CREATE POLICY "Anyone can view post images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'post-images');

-- Authenticated users with appropriate roles can upload post images
CREATE POLICY "Users can upload post images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'post-images'
        AND auth.uid() IS NOT NULL
    );

-- Users can update their own images
CREATE POLICY "Users can update post images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'post-images'
        AND auth.uid() IS NOT NULL
    );

-- Admins can delete post images
CREATE POLICY "Admins can delete post images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'post-images'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('GLOBAL_ADMIN', 'CONTENT_ADMIN')
        )
    );
