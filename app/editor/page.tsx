"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCan } from '@/hooks/useAuthorization';
import EditorHeader from '@/components/editor/EditorHeader';
import DocumentEditor from '@/components/editor/DocumentEditor';
import { Loader2 } from 'lucide-react';

export default function EditorPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const canEditBlog = useCan('manage_blog_own');

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Document content state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Auto-save simulation
    useEffect(() => {
        if (title || content) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                setIsSaving(false);
                setLastSaved(new Date());
            }, 1500);
            return () => clearTimeout(timer);
        }
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

    const handlePublish = () => {
        if (!title.trim()) {
            alert('Por favor, añade un título al post');
            return;
        }
        if (!content.trim()) {
            alert('Por favor, añade contenido al post');
            return;
        }
        // TODO: Implement publish logic with Supabase
        alert('¡Post listo para publicar!\n\nTítulo: ' + title);
    };

    const handlePreview = () => {
        // TODO: Implement preview modal
        alert('Vista previa próximamente');
    };

    return (
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
        </div>
    );
}
