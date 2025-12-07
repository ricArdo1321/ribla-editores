"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { COLORS, JOURNAL_POSTS } from '@/constants';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    cover_image: string | null;
    published_at: string;
    author: {
        full_name: string;
    } | null;
}

export default function BlogListPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('id, title, slug, excerpt, category, cover_image, published_at, author:profiles(full_name)')
                    .eq('status', 'published')
                    .order('published_at', { ascending: false });

                if (error) throw error;
                if (data) setPosts(data as any);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            <Header />

            <main className="pt-32 pb-24">
                <div className="max-w-[1200px] mx-auto px-6">
                    {/* Header */}
                    <div className="mb-16">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                        <h1
                            className="text-4xl md:text-5xl font-light tracking-wide mb-4"
                            style={{ color: COLORS.ashGray }}
                        >
                            Journal
                        </h1>
                        <p className="text-lg text-gray-500 max-w-2xl">
                            Reflexiones, entrevistas y ensayos sobre el mundo editorial, la literatura y el arte de hacer libros.
                        </p>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    )}

                    {/* Posts Grid */}
                    {!isLoading && posts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link href={`/blog/${post.slug}`} key={post.id}>
                                    <article className="group">
                                        <div className="overflow-hidden mb-4 aspect-[16/10] w-full bg-gray-100 rounded-lg">
                                            {post.cover_image ? (
                                                <img
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                    <span className="text-5xl font-light text-gray-300">{post.title.charAt(0)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="text-[10px] tracking-widest font-medium uppercase"
                                                style={{ color: COLORS.terracotta }}
                                            >
                                                {post.category || 'General'}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-[10px] text-gray-400">
                                                {formatDate(post.published_at)}
                                            </span>
                                        </div>

                                        <h2
                                            className="text-lg font-medium leading-snug mb-2 group-hover:text-[#D96B27] transition-colors"
                                            style={{ color: COLORS.ashGray }}
                                        >
                                            {post.title}
                                        </h2>

                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {post.excerpt || 'Sin descripción.'}
                                        </p>

                                        {post.author && (
                                            <p className="text-xs text-gray-400 mt-3">
                                                Por <span className="text-gray-600">{post.author.full_name}</span>
                                            </p>
                                        )}
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && posts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 mb-4">No hay artículos publicados aún.</p>
                            <p className="text-sm text-gray-400">
                                Los artículos aparecerán aquí cuando se publiquen desde el editor.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
