"use client";

import React, { useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import { supabase } from '@/lib/supabaseClient';
import { compressPostImage } from '@/lib/imageCompression';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link,
    Image,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Quote,
    Upload,
    Loader2,
} from 'lucide-react';

interface EditorToolbarProps {
    editor: Editor | null;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-3 rounded-lg hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-6 bg-gray-200 mx-1" />;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt('URL del enlace:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const handleImageClick = () => {
        // Show options: upload or URL
        const choice = window.confirm(
            '¿Subir una imagen?\n\nAceptar = Subir archivo\nCancelar = Usar URL externa'
        );

        if (choice) {
            // Upload file
            fileInputRef.current?.click();
        } else {
            // Use URL
            const url = window.prompt('URL de la imagen:');
            if (url) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Solo se permiten archivos de imagen');
            return;
        }

        // Validate file size (max 10MB before compression)
        if (file.size > 10 * 1024 * 1024) {
            alert('La imagen no puede superar 10MB');
            return;
        }

        setIsUploading(true);

        try {
            // Compress image
            console.log('Compressing image...');
            const compressedFile = await compressPostImage(file);

            // Try Supabase upload first
            let uploadSuccess = false;
            try {
                const fileExt = compressedFile.name.split('.').pop();
                const fileName = `post-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { data, error } = await supabase.storage
                    .from('post-images')
                    .upload(fileName, compressedFile);

                if (!error && data) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('post-images')
                        .getPublicUrl(fileName);

                    editor.chain().focus().setImage({ src: publicUrl }).run();
                    console.log('Image uploaded to Supabase:', publicUrl);
                    uploadSuccess = true;
                } else {
                    console.warn('Supabase upload failed:', error?.message);
                }
            } catch (uploadErr) {
                console.warn('Supabase not available:', uploadErr);
            }

            // Fallback: Convert to base64 and embed directly
            if (!uploadSuccess) {
                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(compressedFile);
                });
                editor.chain().focus().setImage({ src: base64 }).run();
                console.log('Image embedded as base64');
            }

        } catch (err: any) {
            console.error('Image processing error:', err);
            alert('Error al procesar la imagen: ' + (err?.message || 'Error desconocido'));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-50 border-b border-gray-200">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Undo/Redo */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Deshacer"
            >
                <Undo className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Rehacer"
            >
                <Redo className="w-5 h-5" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Título grande"
            >
                <Heading1 className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Título mediano"
            >
                <Heading2 className="w-5 h-5" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text Formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Negrita"
            >
                <Bold className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Cursiva"
            >
                <Italic className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Subrayado"
            >
                <Underline className="w-5 h-5" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Lista con viñetas"
            >
                <List className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Lista numerada"
            >
                <ListOrdered className="w-5 h-5" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Quote */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Cita"
            >
                <Quote className="w-5 h-5" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Link & Image */}
            <ToolbarButton
                onClick={addLink}
                isActive={editor.isActive('link')}
                title="Insertar enlace"
            >
                <Link className="w-5 h-5" />
            </ToolbarButton>
            <ToolbarButton
                onClick={handleImageClick}
                disabled={isUploading}
                title="Insertar imagen"
            >
                {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Image className="w-5 h-5" />
                )}
            </ToolbarButton>
        </div>
    );
}
