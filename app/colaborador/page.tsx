"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import {
    FileText,
    Image as ImageIcon,
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Eye,
    Upload,
    Loader2,
    Check,
    Clock,
    Send,
    PenLine,
    Book
} from 'lucide-react';

// Mock data for collaborator's posts
const MY_POSTS = [
    { id: 1, title: 'El papel en la era digital', date: 'Oct 2025', status: 'published', views: 1234 },
    { id: 2, title: 'Reflexiones sobre la lectura', date: 'Sep 2025', status: 'draft', views: 0 },
    { id: 3, title: 'Nuevo artículo en progreso', date: 'Nov 2025', status: 'draft', views: 0 },
];

const MY_MEDIA = [
    { id: 1, name: 'imagen-post-1.jpg', size: '245 KB', date: 'Oct 2025' },
    { id: 2, name: 'foto-autor.jpg', size: '312 KB', date: 'Sep 2025' },
];

export default function CollaboratorDashboard() {
    const router = useRouter();
    const { user, role, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<'posts' | 'media'>('posts');

    // Protect route - allow all roles since Collaborator is the base role
    // Higher roles (CONTENT_ADMIN, GLOBAL_ADMIN) will also have access as they have all collaborator permissions
    useEffect(() => {
        if (!isLoading && !role) {
            router.push('/');
        }
    }, [isLoading, role, router]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#faf9f7]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
        );
    }

    if (!role) {
        return null;
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full"><Check className="w-3 h-3" /> Publicado</span>;
            case 'draft':
                return <span className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full"><Clock className="w-3 h-3" /> Borrador</span>;
            default:
                return null;
        }
    };

    const publishedCount = MY_POSTS.filter(p => p.status === 'published').length;
    const draftCount = MY_POSTS.filter(p => p.status === 'draft').length;

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800">Mi Escritorio</h1>
                                <p className="text-sm text-gray-500">Hola, {user?.name}</p>
                            </div>
                        </div>

                        <Link
                            href="/editor"
                            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-full text-sm font-medium hover:bg-orange-700 transition-colors"
                        >
                            <PenLine className="w-4 h-4" />
                            Escribir post
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Send className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-gray-800">{publishedCount}</p>
                                <p className="text-sm text-gray-500">Publicados</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-gray-800">{draftCount}</p>
                                <p className="text-sm text-gray-500">Borradores</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-gray-800">{MY_MEDIA.length}</p>
                                <p className="text-sm text-gray-500">Archivos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'posts'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <FileText className="w-4 h-4 inline-block mr-2" />
                        Mis Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'media'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <ImageIcon className="w-4 h-4 inline-block mr-2" />
                        Mis Archivos
                    </button>
                </div>

                {/* Posts Tab */}
                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        {MY_POSTS.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-800 mb-2">
                                    Aún no tienes posts
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    ¡Empieza a escribir tu primer artículo!
                                </p>
                                <Link
                                    href="/editor"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-full text-sm font-medium hover:bg-orange-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Crear mi primer post
                                </Link>
                            </div>
                        ) : (
                            MY_POSTS.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
                                            {getStatusBadge(post.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{post.date}</span>
                                            {post.status === 'published' && (
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" /> {post.views.toLocaleString()} vistas
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {post.status === 'published' && (
                                            <Link
                                                href="/blog"
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="Ver publicación"
                                            >
                                                <Eye className="w-5 h-5 text-gray-400" />
                                            </Link>
                                        )}
                                        <Link
                                            href="/editor"
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit className="w-5 h-5 text-gray-400" />
                                        </Link>
                                        <button
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Add new post card */}
                        <Link
                            href="/editor"
                            className="block bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-all group"
                        >
                            <Plus className="w-8 h-8 text-gray-300 group-hover:text-orange-500 mx-auto mb-2 transition-colors" />
                            <span className="text-sm text-gray-400 group-hover:text-orange-600 transition-colors">
                                Escribir nuevo post
                            </span>
                        </Link>
                    </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                    <div className="space-y-6">
                        {/* Upload area */}
                        <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 p-12 text-center hover:border-purple-400 transition-colors cursor-pointer">
                            <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">Arrastra archivos aquí o haz clic para subir</p>
                            <p className="text-sm text-gray-400 mt-2">PNG, JPG, GIF hasta 10MB</p>
                        </div>

                        {/* Media list */}
                        {MY_MEDIA.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {MY_MEDIA.map((file, index) => (
                                    <div
                                        key={file.id}
                                        className={`flex items-center justify-between p-4 ${index !== MY_MEDIA.length - 1 ? 'border-b border-gray-100' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={`https://picsum.photos/seed/media${file.id}/100/100`}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                                <p className="text-xs text-gray-400">{file.size} • {file.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                <Eye className="w-4 h-4 text-gray-400" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
