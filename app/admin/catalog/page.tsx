"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { supabase } from '@/lib/supabaseClient';
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Eye,
    Loader2,
    BookOpen,
    Search,
    Filter,
    Globe,
    GlobeLock
} from 'lucide-react';

interface Book {
    id: string;
    title: string;
    subtitle: string | null;
    author: string;
    year: number;
    category: string;
    cover_url: string | null;
    status: string | null;
    price: number | null;
    created_at: string | null;
}

export default function CatalogPage() {
    const router = useRouter();
    const { user, role, isLoading: authLoading } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Protect route - only GLOBAL_ADMIN and CONTENT_ADMIN
    useEffect(() => {
        if (!authLoading && role !== UserRole.GLOBAL_ADMIN && role !== UserRole.CONTENT_ADMIN) {
            router.push('/');
        }
    }, [authLoading, role, router]);

    // Fetch books from database
    useEffect(() => {
        const fetchBooks = async () => {
            console.log('Fetching books...');
            try {
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .order('created_at', { ascending: false });

                console.log('Books fetch result:', { data, error });

                if (error) {
                    console.error('Error fetching books:', error);
                    setError('Error al cargar los libros: ' + error.message);
                } else {
                    console.log('Books loaded:', data?.length || 0);
                    setBooks(data || []);
                }
            } catch (err: any) {
                console.error('Unexpected error:', err);
                setError('Error inesperado al cargar los libros');
            } finally {
                setIsLoading(false);
            }
        };

        console.log('Auth state:', { authLoading, role });
        if (!authLoading && (role === UserRole.GLOBAL_ADMIN || role === UserRole.CONTENT_ADMIN)) {
            fetchBooks();
        }
    }, [authLoading, role]);

    // Toggle publish status
    const togglePublish = async (bookId: string, currentStatus: string | null) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';

        try {
            const { error } = await supabase
                .from('books')
                .update({ status: newStatus } as any)
                .eq('id', bookId);

            if (error) {
                alert('Error al cambiar estado: ' + error.message);
                return;
            }

            // Update local state
            setBooks(books.map(b =>
                b.id === bookId ? { ...b, status: newStatus } : b
            ));
        } catch (err) {
            console.error('Publish error:', err);
            alert('Error al cambiar el estado del libro');
        }
    };

    // Delete book
    const handleDelete = async (bookId: string, coverUrl: string | null) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) return;

        try {
            // Delete from database
            const { error } = await supabase
                .from('books')
                .delete()
                .eq('id', bookId);

            if (error) {
                alert('Error al eliminar: ' + error.message);
                return;
            }

            // Remove from local state
            setBooks(books.filter(b => b.id !== bookId));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error al eliminar el libro');
        }
    };

    // Filter books by search term
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading || isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (role !== UserRole.GLOBAL_ADMIN && role !== UserRole.CONTENT_ADMIN) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-medium text-gray-800">Catálogo de Libros</h1>
                            <p className="text-xs text-gray-500">{books.length} libros en total</p>
                        </div>
                    </div>

                    <Link
                        href="/admin/books/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Añadir libro
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Error Banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título o autor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                            {searchTerm ? 'No se encontraron libros' : 'No hay libros todavía'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {searchTerm ? 'Intenta con otra búsqueda' : 'Comienza añadiendo tu primer libro al catálogo'}
                        </p>
                        {!searchTerm && (
                            <Link
                                href="/admin/books/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Añadir libro
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                            >
                                {/* Cover */}
                                <div className="aspect-[2/3] relative bg-gray-100">
                                    {book.cover_url ? (
                                        <img
                                            src={book.cover_url}
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${book.status === 'published'
                                        ? 'bg-green-100 text-green-700'
                                        : book.status === 'draft'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {book.status === 'published' ? 'Publicado' : book.status === 'draft' ? 'Borrador' : book.status}
                                    </span>

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => togglePublish(book.id, book.status ?? 'draft')}
                                            className={`p-2 bg-white rounded-full transition-colors ${book.status === 'published'
                                                ? 'hover:bg-yellow-50'
                                                : 'hover:bg-green-50'
                                                }`}
                                            title={book.status === 'published' ? 'Despublicar' : 'Publicar'}
                                        >
                                            {book.status === 'published'
                                                ? <GlobeLock className="w-4 h-4 text-yellow-600" />
                                                : <Globe className="w-4 h-4 text-green-600" />
                                            }
                                        </button>
                                        <Link
                                            href={`/libro/${book.id}`}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                            title="Ver ficha"
                                        >
                                            <Eye className="w-4 h-4 text-gray-700" />
                                        </Link>
                                        <Link
                                            href={`/admin/books/${book.id}/edit`}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                            title="Editar"
                                        >
                                            <Edit className="w-4 h-4 text-gray-700" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(book.id, book.cover_url)}
                                            className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {book.author}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>{book.year}</span>
                                        {book.price && <span>${book.price}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
