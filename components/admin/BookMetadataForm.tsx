"use client";

import React from 'react';
import { BookOpen, Calendar, User, Tag } from 'lucide-react';

interface BookMetadataFormProps {
    title: string;
    setTitle: (value: string) => void;
    subtitle: string;
    setSubtitle: (value: string) => void;
    author: string;
    setAuthor: (value: string) => void;
    year: string;
    setYear: (value: string) => void;
    isbn: string;
    setIsbn: (value: string) => void;
    pages: string;
    setPages: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    categories: string[];
    errors: Record<string, string>;
}

export default function BookMetadataForm({
    title, setTitle,
    subtitle, setSubtitle,
    author, setAuthor,
    year, setYear,
    isbn, setIsbn,
    pages, setPages,
    category, setCategory,
    categories,
    errors
}: BookMetadataFormProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Información básica
            </h2>

            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                        Título <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título del libro"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                {/* Subtitle */}
                <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Subtítulo</label>
                    <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="Subtítulo (opcional)"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Author & Year */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">
                            <User className="w-3 h-3 inline mr-1" />
                            Autor <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Nombre del autor"
                            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.author ? 'border-red-300' : 'border-gray-200'}`}
                        />
                        {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Año <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="2024"
                            min="1900"
                            max={new Date().getFullYear()}
                            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.year ? 'border-red-300' : 'border-gray-200'}`}
                        />
                        {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year}</p>}
                    </div>
                </div>

                {/* ISBN & Pages */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">ISBN</label>
                        <input
                            type="text"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            placeholder="978-xxx-xxx-xxxx"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1.5">Páginas</label>
                        <input
                            type="number"
                            value={pages}
                            onChange={(e) => setPages(e.target.value)}
                            placeholder="Número de páginas"
                            min="1"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                        <Tag className="w-3 h-3 inline mr-1" />
                        Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.category ? 'border-red-300' : 'border-gray-200'}`}
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>
            </div>
        </div>
    );
}
