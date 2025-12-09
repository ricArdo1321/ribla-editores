"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCan } from '@/hooks/useAuthorization';
import EditorHeader from '@/components/editor/EditorHeader';
import DocumentEditor from '@/components/editor/DocumentEditor';
import { Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { sanitizeContent } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export default function EditorPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const canEditBlog = useCan('manage_blog_own');

    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Document content state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [postId, setPostId] = useState<string | null>(null);

    // Show notification
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    // Save as draft
    const saveDraft = async () => {
        if (!title.trim()) return;

        setIsSaving(true);
        try {
            const token = localStorage.getItem('wp_token');
            if (!token) throw new Error('No authenticated');

            const { getAuthClient } = await import('@/lib/wordpress');
            const { CREATE_POST_MUTATION, UPDATE_POST_MUTATION } = await import('@/lib/mutations');

            const client = getAuthClient(token);

            let data: any;

            if (postId) {
                // Update existing post
                data = await client.request(UPDATE_POST_MUTATION, {
                    id: postId,
                    title: title.trim(),
                    content: content,
                    status: 'DRAFT'
                });
            } else {
                // Create new post
                data = await client.request(CREATE_POST_MUTATION, {
                    title: title.trim(),
                    content: content,
                    status: 'DRAFT'
                });

                if (data?.createPost?.post?.id) {
                    setPostId(data.createPost.post.id);
                }
            }

            setLastSaved(new Date());
        } catch (error: any) {
            console.error('Error saving draft:', error);
            showNotification('error', 'Error al guardar: ' + (error.message || 'Intenta de nuevo'));
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-save every 30 seconds if there's content
    useEffect(() => {
        if (!title.trim() || !user) return;

        const timer = setTimeout(() => {
            saveDraft();
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
    }, [title, content]);

    // Auth check
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [authLoading, user, router]);

    // Loading state
    if (authLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-gray-600">Cargando editor...</p>
                </div>
            </div>
        );
    }

    // Permission check
    if (!canEditBlog) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        Acceso denegado
                    </h1>
                    <p className="text-gray-600 mb-4">
                        No tienes permisos para crear posts.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    const handlePublish = async () => {
        if (!title.trim()) {
            showNotification('error', 'Por favor, añade un título al post');
            return;
        }
        if (!content.trim()) {
            showNotification('error', 'Por favor, añade contenido al post');
            return;
        }

        setIsPublishing(true);
        try {
            const token = localStorage.getItem('wp_token');
            if (!token) throw new Error('No authenticated');

            const { getAuthClient } = await import('@/lib/wordpress');
            const { CREATE_POST_MUTATION, UPDATE_POST_MUTATION } = await import('@/lib/mutations');

            const client = getAuthClient(token);

            let data: any;

            if (postId) {
                // Update existing post to published
                data = await client.request(UPDATE_POST_MUTATION, {
                    id: postId,
                    title: title.trim(),
                    content: content,
                    status: 'PUBLISH'
                });
            } else {
                // Create and publish new post
                data = await client.request(CREATE_POST_MUTATION, {
                    title: title.trim(),
                    content: content,
                    status: 'PUBLISH'
                });

                if (data?.createPost?.post?.id) {
                    setPostId(data.createPost.post.id);
                }
            }

            showNotification('success', '¡Post publicado exitosamente!');

            // Redirect to admin after short delay
            setTimeout(() => {
                router.push('/admin');
            }, 2000);

        } catch (error: any) {
            console.error('Error publishing:', error);
            showNotification('error', 'Error al publicar: ' + (error.message || 'Intenta de nuevo'));
        } finally {
            setIsPublishing(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!title.trim()) {
            showNotification('error', 'Por favor, añade un título para guardar');
            return;
        }
        await saveDraft();
        showNotification('success', 'Borrador guardado');
    };

    const handlePreview = () => {
        if (!title.trim() && !content.trim()) {
            showNotification('error', 'Añade contenido para ver la vista previa');
            return;
        }
        setShowPreview(true);
    };


    return (
        <>
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{notification.message}</span>
                </div>
            )}

            <div className="h-screen flex flex-col overflow-hidden">
                {/* Editor Header */}
                <EditorHeader
                    isSaving={isSaving}
                    lastSaved={lastSaved}
                    onPublish={handlePublish}
                    onPreview={handlePreview}
                />

                {/* Editor */}
                <DocumentEditor
                    onTitleChange={setTitle}
                    onContentChange={setContent}
                />

                {/* Preview Modal */}
                {showPreview && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-800">Vista Previa</h2>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <article className="prose prose-lg max-w-none">
                                    {/* Title */}
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                        {title || 'Sin título'}
                                    </h1>

                                    {/* Author & Date */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 not-prose">
                                        <span>Por {user?.name || 'Autor'}</span>
                                        <span>•</span>
                                        <span>{new Date().toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}</span>
                                    </div>

                                    {/* Content */}
                                    <div
                                        dangerouslySetInnerHTML={{ __html: sanitizeContent(content || '<p>Sin contenido</p>') }}
                                    />
                                </article>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Así se verá tu post cuando lo publiques
                                    </p>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
