"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { COLORS } from '@/constants';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    User,
    Hash,
    FileText,
    Tag,
    ExternalLink,
    Loader2,
    ShoppingCart
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Book {
    id: string;
    title: string;
    subtitle: string | null;
    author: string;
    year: number;
    isbn: string | null;
    pages: number | null;
    category: string;
    description: string | null;
    price: number | null;
    is_digital_only: boolean | null;
    cover_url: string | null;
    pdf_url: string | null;
    affiliate_links: { name: string; url: string }[] | null;
    status: string | null;
}

export default function BookDetailPage() {
    const params = useParams();
    const bookId = params.id as string;

    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .eq('id', bookId)
                    .single();

                if (error) {
                    console.error('Error fetching book:', error);
                    setError('Libro no encontrado');
                    return;
                }

                setBook(data as unknown as Book);
            } catch (err) {
                console.error('Unexpected error:', err);
                setError('Error al cargar el libro');
            } finally {
                setIsLoading(false);
            }
        };

        if (bookId) {
            fetchBook();
        }
    }, [bookId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: COLORS.terracotta }} />
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h1 className="text-2xl font-light mb-2" style={{ color: COLORS.ashGray }}>
                        {error || 'Libro no encontrado'}
                    </h1>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mt-6 text-sm"
                        style={{ color: COLORS.terracotta }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <Link
                        href="/#catalog"
                        className="inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                        style={{ color: COLORS.ashGray }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al catálogo
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

                    {/* Cover Image */}
                    <div className="flex justify-center md:justify-end">
                        <div className="w-full max-w-md aspect-[2/3] bg-gray-100 shadow-xl">
                            {book.cover_url ? (
                                <img
                                    src={book.cover_url}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen className="w-24 h-24 text-gray-300" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Book Info */}
                    <div className="space-y-8">
                        {/* Category */}
                        <span
                            className="inline-block px-3 py-1 border text-xs tracking-widest uppercase"
                            style={{
                                borderColor: 'rgba(74, 74, 72, 0.2)',
                                color: COLORS.ashGray
                            }}
                        >
                            {book.category}
                        </span>

                        {/* Title & Author */}
                        <div>
                            <h1
                                className="text-3xl md:text-4xl font-light leading-tight mb-2"
                                style={{ color: COLORS.ashGray }}
                            >
                                {book.title}
                            </h1>
                            {book.subtitle && (
                                <p className="text-lg text-gray-500 font-light mb-4">
                                    {book.subtitle}
                                </p>
                            )}
                            <p className="text-lg" style={{ color: COLORS.ashGray }}>
                                <User className="w-4 h-4 inline mr-2" />
                                {book.author}
                            </p>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {book.year}
                            </span>
                            {book.pages && (
                                <span className="flex items-center gap-1.5">
                                    <FileText className="w-4 h-4" />
                                    {book.pages} páginas
                                </span>
                            )}
                            {book.isbn && (
                                <span className="flex items-center gap-1.5">
                                    <Hash className="w-4 h-4" />
                                    {book.isbn}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {book.description && (
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-600 leading-relaxed font-light">
                                    {book.description}
                                </p>
                            </div>
                        )}

                        {/* Price & Format */}
                        <div className="pt-4 border-t border-gray-200">
                            {book.price && (
                                <p className="text-2xl font-light mb-2" style={{ color: COLORS.terracotta }}>
                                    ${book.price} USD
                                </p>
                            )}
                            {book.is_digital_only && (
                                <p className="text-sm text-gray-500">
                                    Solo disponible en formato digital
                                </p>
                            )}
                        </div>

                        {/* Affiliate Links */}
                        {book.affiliate_links && book.affiliate_links.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm font-medium" style={{ color: COLORS.ashGray }}>
                                    Comprar en:
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {book.affiliate_links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-gray-400 transition-colors"
                                            style={{ color: COLORS.ashGray }}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            {link.name}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PDF Download */}
                        {book.pdf_url && (
                            <div className="pt-4">
                                <a
                                    href={book.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors hover:opacity-90"
                                    style={{ backgroundColor: COLORS.terracotta }}
                                >
                                    <FileText className="w-4 h-4" />
                                    Descargar PDF
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
