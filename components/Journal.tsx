"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2 } from 'lucide-react';
import { COLORS, JOURNAL_POSTS } from '../constants';
import { wpClient } from '@/lib/wordpress';
import { GET_POSTS } from '@/lib/queries';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_image: string | null;
  published_at: string | null;
}

const Journal: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data: any = await wpClient.request(GET_POSTS, { first: 4 });

        if (data?.posts?.nodes) {
          const mappedPosts: Post[] = data.posts.nodes.map((node: any) => ({
            id: node.id,
            title: node.title,
            slug: node.slug,
            excerpt: node.excerpt ? node.excerpt.replace(/<[^>]+>/g, '') : null, // Strip HTML from excerpt
            category: node.categories?.nodes[0]?.name || 'General',
            cover_image: node.featuredImage?.node?.sourceUrl || null,
            published_at: node.date,
          }));
          setPosts(mappedPosts);
        }
      } catch (err) {
        console.error('Error fetching posts from WP:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).toUpperCase();
  };

  // Use mock data if no posts from DB
  const displayPosts = posts.length > 0 ? posts : [];
  const showMockData = posts.length === 0 && !isLoading;

  return (
    <section id="journal" className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-100 pb-6">
          <h2
            className="text-2xl md:text-3xl font-light tracking-wide"
            style={{ color: COLORS.ashGray }}
          >
            Journal
          </h2>
          <Link
            href="/journal"
            className="hidden md:flex items-center text-xs tracking-widest text-gray-400 hover:text-[#D96B27] transition-colors mt-4 md:mt-0"
          >
            VER TODOS LOS ARTÍCULOS <ArrowRight size={12} className="ml-2" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Grid - Real Posts */}
        {!isLoading && displayPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {displayPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <article className="group cursor-pointer">
                  <div className="overflow-hidden mb-6 aspect-[16/9] w-full bg-gray-100">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-6xl font-light text-gray-300">{post.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] tracking-[0.2em] font-medium text-[#D96B27] uppercase">
                      {post.category || 'General'}
                    </span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span className="text-[10px] tracking-widest text-gray-400">
                      {formatDate(post.published_at || new Date().toISOString())}
                    </span>
                  </div>

                  <h3
                    className="text-xl md:text-2xl font-normal leading-tight mb-3 group-hover:text-[#D96B27] transition-colors"
                    style={{ color: COLORS.ashGray }}
                  >
                    {post.title}
                  </h3>

                  <p className="text-sm font-light text-gray-400 leading-relaxed max-w-md">
                    {post.excerpt || 'Sin descripción disponible.'}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State - Show mock data fallback */}
        {showMockData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {JOURNAL_POSTS.slice(0, 4).map((post) => (
              <article key={post.id} className="group cursor-pointer opacity-60">
                <div className="overflow-hidden mb-6 aspect-[16/9] w-full bg-gray-50">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] tracking-[0.2em] font-medium text-[#D96B27] uppercase">
                    {post.category}
                  </span>
                  <span className="w-px h-3 bg-gray-300"></span>
                  <span className="text-[10px] tracking-widest text-gray-400">
                    {post.date}
                  </span>
                </div>

                <h3
                  className="text-xl md:text-2xl font-normal leading-tight mb-3 group-hover:text-[#D96B27] transition-colors"
                  style={{ color: COLORS.ashGray }}
                >
                  {post.title}
                </h3>

                <p className="text-sm font-light text-gray-400 leading-relaxed max-w-md">
                  {post.excerpt}
                </p>
              </article>
            ))}
            <div className="col-span-full text-center py-4">
              <p className="text-sm text-gray-400 italic">
                Estos son artículos de ejemplo. Publica tu primer post desde el editor.
              </p>
            </div>
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="md:hidden mt-12 text-center">
          <Link
            href="/journal"
            className="inline-flex items-center text-xs tracking-widest text-gray-400 hover:text-[#D96B27] transition-colors border-b border-gray-200 pb-1"
          >
            VER JOURNAL <ArrowRight size={12} className="ml-2" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Journal;