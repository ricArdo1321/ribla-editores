"use client";

import React, { useRef } from 'react';
import { FileText, FileUp, X } from 'lucide-react';

interface BookPdfUploadProps {
    pdfFile: File | null;
    error?: string;
    onPdfChange: (file: File) => void;
    onRemove: () => void;
}

export default function BookPdfUpload({
    pdfFile,
    error,
    onPdfChange,
    onRemove
}: BookPdfUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                return;
            }
            onPdfChange(file);
        }
    };

    const handleRemove = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onRemove();
    };

    return (
        <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Archivo PDF (opcional)
            </h2>

            {pdfFile ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <FileUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                            {pdfFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1.5 hover:bg-green-100 rounded transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            ) : (
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                    <FileUp className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Subir PDF</span>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleChange}
                        className="hidden"
                    />
                </label>
            )}
            {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}
