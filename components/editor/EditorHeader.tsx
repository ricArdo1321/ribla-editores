"use client";

import React, { useState } from 'react';
import {
    FileText,
    Check,
    Loader2,
    ArrowLeft,
    Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditorHeaderProps {
    isSaving?: boolean;
    lastSaved?: Date | null;
    onPublish?: () => void;
    onPreview?: () => void;
}

export default function EditorHeader({
    isSaving = false,
    lastSaved = null,
    onPublish,
    onPreview,
}: EditorHeaderProps) {
    const router = useRouter();

    const formatLastSaved = () => {
        if (!lastSaved) return 'Sin guardar';
        const now = new Date();
        const diff = now.getTime() - lastSaved.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Guardado';
        if (minutes === 1) return 'Guardado hace 1 min';
        if (minutes < 60) return `Guardado hace ${minutes} min`;

        return `Guardado a las ${lastSaved.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Volver al inicio"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Logo/Title */}
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800">Nuevo Post</span>
                </div>

                {/* Save Status */}
                <div className="text-sm text-gray-500">
                    {isSaving ? (
                        <span className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Guardando...
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-500" />
                            {formatLastSaved()}
                        </span>
                    )}
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Preview Button */}
                <button
                    onClick={onPreview}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    Vista previa
                </button>

                {/* Publish Button */}
                <button
                    onClick={onPublish}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Publicar
                </button>
            </div>
        </header>
    );
}
