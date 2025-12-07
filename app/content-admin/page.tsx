"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import {
    LayoutDashboard,
    FileText,
    BookOpen,
    Image as ImageIcon,
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Eye,
    Upload,
    Search,
    Filter,
    Loader2,
    Check,
    Clock
} from 'lucide-react';

// Dashboard sections for Content Admin
const CONTENT_SECTIONS = [
    {
        id: 'overview',
        name: 'Resumen',
        icon: LayoutDashboard,
        description: 'Vista general del contenido',
    },
    {
        id: 'posts',
        name: 'Posts',
        icon: FileText,
        description: 'Gestionar artículos del blog',
        count: 24
    },
    {
        id: 'catalog',
        name: 'Catálogo',
        icon: BookOpen,
        description: 'Gestionar libros y publicaciones',
        count: 6
    },
    {
        id: 'media',
        name: 'Multimedia',
        icon: ImageIcon,
        description: 'Galería de imágenes y archivos',
        count: 45
    },
];

// Mock data
const MOCK_POSTS = [
    { id: 1, title: 'El papel en la era digital', author: 'Elena Varela', date: 'Oct 2025', status: 'published', views: 1234 },
    { id: 2, title: 'Conversación con Elena Varela', author: 'Redacción', date: 'Sep 2025', status: 'published', views: 892 },
    { id: 3, title: 'La tipografía emocional', author: 'María Soto', date: 'Ago 2025', status: 'draft', views: 0 },
    { id: 4, title: 'Estado de la poesía contemporánea', author: 'Javier Sola', date: 'Jul 2025', status: 'published', views: 567 },
    { id: 5, title: 'El auge de la edición independiente', author: 'Sofía Costa', date: 'Jun 2025', status: 'review', views: 0 },
];

const MOCK_BOOKS = [
    { id: 1, title: 'El Silencio de los Algoritmos', author: 'Elena Varela', year: 2025, status: 'published' },
    { id: 2, title: 'Cartografía del Olvido', author: 'Javier M. Sola', year: 2025, status: 'published' },
    { id: 3, title: 'Frecuencia Modular', author: 'Anaís Nin', year: 2025, status: 'draft' },
];

const MOCK_MEDIA = [
    { id: 1, name: 'journal1.jpg', type: 'image', size: '245 KB', date: 'Oct 2025' },
    { id: 2, name: 'journal2.jpg', type: 'image', size: '312 KB', date: 'Sep 2025' },
    { id: 3, name: 'book-cover-1.jpg', type: 'image', size: '1.2 MB', date: 'Ago 2025' },
    { id: 4, name: 'author-photo.png', type: 'image', size: '456 KB', date: 'Jul 2025' },
];

export default function ContentAdminDashboard() {
    const router = useRouter();
    const { user, role, isLoading } = useAuth();
    const [activeSection, setActiveSection] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    // Protect route - only CONTENT_ADMIN or GLOBAL_ADMIN
    useEffect(() => {
        if (!isLoading && role !== UserRole.CONTENT_ADMIN && role !== UserRole.GLOBAL_ADMIN) {
            router.push('/');
        }
    }, [isLoading, role, router]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (role !== UserRole.CONTENT_ADMIN && role !== UserRole.GLOBAL_ADMIN) {
        return null;
    }

    const currentSection = CONTENT_SECTIONS.find(s => s.id === activeSection);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded"><Check className="w-3 h-3" /> Publicado</span>;
            case 'draft':
                return <span className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded"><Clock className="w-3 h-3" /> Borrador</span>;
            case 'review':
                return <span className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"><Eye className="w-3 h-3" /> En revisión</span>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-green-900 to-green-800 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-green-700">
                    <h1 className="text-lg font-medium">Ribla Editores</h1>
                    <p className="text-xs text-green-300 mt-1">Panel de Contenidos</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {CONTENT_SECTIONS.map((section) => {
                            const Icon = section.icon;
                            return (
                                <li key={section.id}>
                                    <button
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeSection === section.id
                                                ? 'bg-green-600 text-white'
                                                : 'text-green-200 hover:bg-green-700 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {section.name}
                                        {section.count !== undefined && (
                                            <span className="ml-auto text-xs bg-green-950/50 px-2 py-0.5 rounded">
                                                {section.count}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-green-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-green-300">Admin de Contenidos</p>
                        </div>
                    </div>
                </div>

                {/* Back to site */}
                <Link
                    href="/"
                    className="m-4 flex items-center gap-2 px-4 py-3 text-sm text-green-200 hover:text-white border border-green-600 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al sitio
                </Link>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {currentSection?.name}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {currentSection?.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Add button */}
                            {activeSection !== 'overview' && (
                                <Link
                                    href={activeSection === 'posts' ? '/editor' : '#'}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    {activeSection === 'posts' ? 'Nuevo Post' :
                                        activeSection === 'catalog' ? 'Nuevo Libro' :
                                            'Subir Archivo'}
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">
                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">Posts publicados</span>
                                        <FileText className="w-5 h-5 text-green-500" />
                                    </div>
                                    <p className="text-3xl font-semibold text-gray-800">24</p>
                                    <p className="text-xs text-gray-400 mt-2">3 borradores pendientes</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">Libros en catálogo</span>
                                        <BookOpen className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-3xl font-semibold text-gray-800">6</p>
                                    <p className="text-xs text-gray-400 mt-2">1 próximamente</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">Archivos multimedia</span>
                                        <ImageIcon className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <p className="text-3xl font-semibold text-gray-800">45</p>
                                    <p className="text-xs text-gray-400 mt-2">12.4 MB usados</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">Vistas totales</span>
                                        <Eye className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <p className="text-3xl font-semibold text-gray-800">12.5K</p>
                                    <p className="text-xs text-green-500 mt-2">+18% este mes</p>
                                </div>
                            </div>

                            {/* Recent Posts */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-800">Posts recientes</h3>
                                    <button
                                        onClick={() => setActiveSection('posts')}
                                        className="text-sm text-green-600 hover:underline"
                                    >
                                        Ver todos
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {MOCK_POSTS.slice(0, 3).map((post) => (
                                        <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{post.title}</p>
                                                <p className="text-xs text-gray-500">{post.author} • {post.date}</p>
                                            </div>
                                            {getStatusBadge(post.status)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link href="/editor" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors group">
                                    <FileText className="w-8 h-8 text-green-600 mb-3" />
                                    <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">Escribir nuevo post</h3>
                                    <p className="text-sm text-gray-500 mt-1">Crear un artículo para el blog</p>
                                </Link>
                                <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors group text-left">
                                    <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
                                    <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">Añadir libro</h3>
                                    <p className="text-sm text-gray-500 mt-1">Agregar al catálogo</p>
                                </button>
                                <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-300 transition-colors group text-left">
                                    <Upload className="w-8 h-8 text-purple-600 mb-3" />
                                    <h3 className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">Subir archivos</h3>
                                    <p className="text-sm text-gray-500 mt-1">Imágenes y multimedia</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Posts Section */}
                    {activeSection === 'posts' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            {/* Filters */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
                                <button className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-full">Todos (24)</button>
                                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Publicados (18)</button>
                                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Borradores (3)</button>
                                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full">En revisión (3)</button>
                            </div>

                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Título</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Autor</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Vistas</th>
                                        <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {MOCK_POSTS.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{post.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{post.date}</td>
                                            <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{post.views.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href="/blog" className="p-2 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-500" /></Link>
                                                    <Link href="/editor" className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></Link>
                                                    <button className="p-2 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Catalog Section */}
                    {activeSection === 'catalog' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MOCK_BOOKS.map((book) => (
                                <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="aspect-[3/4] bg-gray-100">
                                        <img
                                            src={`https://picsum.photos/seed/book${book.id}/300/400`}
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-800">{book.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{book.author} • {book.year}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            {getStatusBadge(book.status)}
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></button>
                                                <button className="p-2 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add new card */}
                            <button className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 hover:border-green-400 transition-colors flex flex-col items-center justify-center min-h-[300px] group">
                                <Plus className="w-12 h-12 text-gray-300 group-hover:text-green-500 transition-colors" />
                                <span className="text-sm text-gray-400 group-hover:text-green-600 mt-2">Añadir libro</span>
                            </button>
                        </div>
                    )}

                    {/* Media Section */}
                    {activeSection === 'media' && (
                        <div className="space-y-6">
                            {/* Upload area */}
                            <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-12 text-center hover:border-green-400 transition-colors cursor-pointer">
                                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600">Arrastra archivos aquí o haz clic para subir</p>
                                <p className="text-sm text-gray-400 mt-2">PNG, JPG, GIF hasta 10MB</p>
                            </div>

                            {/* Media grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {MOCK_MEDIA.map((file) => (
                                    <div key={file.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group">
                                        <div className="aspect-square bg-gray-100 relative">
                                            <img
                                                src={`https://picsum.photos/seed/media${file.id}/200/200`}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button className="p-2 bg-white rounded-full"><Eye className="w-4 h-4" /></button>
                                                <button className="p-2 bg-white rounded-full"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <p className="text-xs font-medium text-gray-800 truncate">{file.name}</p>
                                            <p className="text-xs text-gray-400">{file.size}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
