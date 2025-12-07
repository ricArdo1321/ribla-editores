"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Loader2 } from 'lucide-react';
import { COLORS } from '@/constants';
import { wpClient } from '@/lib/wordpress';
import { GET_POST_BY_SLUG } from '@/lib/queries';
import { sanitizeContent } from '@/lib/sanitize';

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    category: string | null;
    published_at: string | null;
    author: {
        full_name: string | null;
    } | null;
}

// Calculate reading time (words per minute)
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Fetch post by slug
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data: any = await wpClient.request(GET_POST_BY_SLUG, { slug });

                if (data?.post) {
                    const mappedPost: Post = {
                        id: data.post.id,
                        title: data.post.title,
                        slug: slug,
                        content: data.post.content,
                        excerpt: null, // Single post query often doesn't need excerpt, usually in content
                        category: data.post.categories?.nodes[0]?.name || 'General',
                        published_at: data.post.date,
                        author: {
                            full_name: data.post.author?.node?.name || 'Autor'
                        }
                    };
                    setPost(mappedPost);
                } else {
                    setError('Post no encontrado');
                }
            } catch (err: any) {
                console.error('Error fetching post from WP:', err);
                setError('Error al cargar el artículo');
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    // Scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setScrollProgress(progress);

            if (scrollTop > lastScrollY && scrollTop > 100) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            setLastScrollY(scrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Error state
    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-medium text-gray-800 mb-2">Artículo no encontrado</h1>
                    <p className="text-gray-500 mb-6">El artículo que buscas no existe o ha sido eliminado.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    const readingTime = calculateReadingTime(post.content || '');
    const formattedDate = new Date(post.published_at || new Date().toISOString()).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                <div
                    className="h-full transition-all duration-150 ease-out"
                    style={{
                        width: `${scrollProgress}%`,
                        backgroundColor: COLORS.terracotta
                    }}
                />
            </div>

            {/* Minimal Header */}
            <header
                className={`fixed top-1 left-0 right-0 z-40 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/#journal"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm transition-colors bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Volver</span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full">
                        <Clock className="w-3 h-3" />
                        {readingTime} min de lectura
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-32">
                <article className="max-w-2xl mx-auto px-6">
                    {/* Category */}
                    <div className="flex items-center gap-3 mb-6">
                        <span
                            className="text-xs font-medium tracking-widest uppercase"
                            style={{ color: COLORS.terracotta }}
                        >
                            {post.category || 'General'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{formattedDate}</span>
                    </div>

                    {/* Title */}
                    <h1
                        className="text-4xl md:text-5xl leading-tight mb-6"
                        style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontWeight: 400,
                            color: '#2d2d2d',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        {post.title}
                    </h1>

                    {/* Author */}
                    <div className="flex items-center gap-3 mb-16 pb-8 border-b border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                                {(post.author?.full_name || 'A').charAt(0)}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{post.author?.full_name || 'Autor'}</p>
                            <p className="text-xs text-gray-400">Colaborador</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="reading-content"
                        dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content || '') }}
                    />

                    {/* End of Article */}
                    <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                        <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <p className="text-sm text-gray-400 mb-6">Fin del artículo</p>
                        <Link
                            href="/#journal"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Journal
                        </Link>
                    </div>
                </article>
            </main>

            <style jsx global>{`
                .reading-content {
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 1.125rem;
                    line-height: 2;
                    color: #3d3d3d;
                }
                
                .reading-content p {
                    margin-bottom: 1.75em;
                    text-align: justify;
                    hyphens: auto;
                }
                
                .reading-content p.lead {
                    font-size: 1.25rem;
                    color: #555;
                    text-align: left;
                    margin-bottom: 2.5em;
                }
                
                .reading-content h2 {
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #2d2d2d;
                    margin-top: 3em;
                    margin-bottom: 1em;
                    text-align: left;
                    letter-spacing: -0.01em;
                }
                
                .reading-content blockquote {
                    border-left: 3px solid ${COLORS.terracotta};
                    padding: 1em 0 1em 2em;
                    margin: 2.5em 0;
                    font-style: italic;
                    color: #555;
                    font-size: 1.2rem;
                    text-align: left;
                    background: linear-gradient(90deg, rgba(217,107,39,0.05) 0%, transparent 100%);
                }
                
                .reading-content ul, .reading-content ol {
                    padding-left: 1.5em;
                    margin: 2em 0;
                }
                
                .reading-content li {
                    margin-bottom: 0.75em;
                    text-align: left;
                    padding-left: 0.5em;
                }
                
                .reading-content li::marker {
                    color: ${COLORS.terracotta};
                }
                
                .reading-content strong {
                    font-weight: 600;
                    color: #2d2d2d;
                }
                
                .reading-content em {
                    font-style: italic;
                }
                
                .reading-content a {
                    color: ${COLORS.terracotta};
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                
                .reading-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 2em 0;
                }

                ::selection {
                    background-color: ${COLORS.desertSand};
                    color: #2d2d2d;
                }
            `}</style>
        </div>
    );
}
