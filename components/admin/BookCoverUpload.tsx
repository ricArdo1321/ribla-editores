"use client";

import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface BookCoverUploadProps {
    coverPreview: string | null;
    error?: string;
    onCoverChange: (file: File) => void;
    onRemove: () => void;
}

export default function BookCoverUpload({
    coverPreview,
    error,
    onCoverChange,
    onRemove
}: BookCoverUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                return;
            }
            onCoverChange(file);
        }
    };

    const handleRemove = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onRemove();
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Portada del libro
            </h2>

            <div className="aspect-[2/3] relative bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                {coverPreview ? (
                    <>
                        <img
                            src={coverPreview}
                            alt="Portada"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-500 text-center px-4">
                            Arrastra una imagen o haz clic para seleccionar
                        </span>
                        <span className="text-xs text-gray-400 mt-2">
                            JPG, PNG (máx. 5MB)
                        </span>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}
