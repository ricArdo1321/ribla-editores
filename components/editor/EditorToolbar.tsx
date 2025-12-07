"use client";

import React from 'react';
import { Editor } from '@tiptap/react';
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
            className={`p-2.5 rounded-lg hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
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
    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt('URL del enlace:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('URL de la imagen:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 border-b border-gray-200">
            {/* Undo/Redo */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Deshacer"
            >
                <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Rehacer"
            >
                <Redo className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Título grande"
            >
                <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Título mediano"
            >
                <Heading2 className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text Formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Negrita"
            >
                <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Cursiva"
            >
                <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Subrayado"
            >
                <Underline className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Lista con viñetas"
            >
                <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Lista numerada"
            >
                <ListOrdered className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Quote */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Cita"
            >
                <Quote className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Link & Image */}
            <ToolbarButton
                onClick={addLink}
                isActive={editor.isActive('link')}
                title="Insertar enlace"
            >
                <Link className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={addImage}
                title="Insertar imagen"
            >
                <Image className="w-4 h-4" />
            </ToolbarButton>
        </div>
    );
}
