"use client";

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import EditorToolbar from './EditorToolbar';

interface DocumentEditorProps {
    onTitleChange?: (title: string) => void;
    onContentChange?: (content: string) => void;
}

export default function DocumentEditor({
    onTitleChange,
    onContentChange,
}: DocumentEditorProps) {
    const [title, setTitle] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Placeholder.configure({
                placeholder: 'Escribe el contenido de tu post aquí...',
            }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content: '',
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            if (onContentChange) {
                onContentChange(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-xl max-w-none focus:outline-none min-h-[400px] font-serif',
                style: 'font-family: Georgia, "Times New Roman", serif; line-height: 1.8;'
            },
        },
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (onTitleChange) {
            onTitleChange(e.target.value);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
            {/* Toolbar */}
            <EditorToolbar editor={editor} />

            {/* Document Area */}
            <div className="flex-1 overflow-y-auto py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Document Card */}
                    <div className="bg-white p-8 min-h-[600px]">
                        {/* Title Input */}
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Título del post"
                            className="w-full text-3xl font-semibold text-gray-800 placeholder-gray-400 border-none outline-none mb-6 bg-transparent"
                        />

                        {/* Divider */}
                        <div className="border-t border-gray-200 mb-6" />

                        {/* Editor Content */}
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>
        </div>
    );
}
