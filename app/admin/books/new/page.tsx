"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { supabase } from '@/lib/supabaseClient';
import { compressBookCover } from '@/lib/imageCompression';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';

// Components
import BookCoverUpload from '@/components/admin/BookCoverUpload';
import BookPdfUpload from '@/components/admin/BookPdfUpload';
import BookMetadataForm from '@/components/admin/BookMetadataForm';
import BookPricingSection from '@/components/admin/BookPricingSection';
import AffiliateLinksSection from '@/components/admin/AffiliateLinksSection';

export const dynamic = 'force-dynamic';

// Constants
const CATEGORIES = [
    'Narrativa', 'Poesía', 'Ensayo', 'Crónica', 'Infantil',
    'Académico', 'Arte', 'Historia', 'Filosofía', 'Otros'
];

const DEFAULT_AFFILIATE_LINKS = [
    { name: 'Amazon', url: '' },
    { name: 'Casa del Libro', url: '' },
    { name: 'Buscalibre', url: '' },
];

export default function NewBookPage() {
    const router = useRouter();
    const { user, role, isLoading } = useAuth();

    // Form state
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [isbn, setIsbn] = useState('');
    const [pages, setPages] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isDigitalOnly, setIsDigitalOnly] = useState(false);
    const [affiliateLinks, setAffiliateLinks] = useState(DEFAULT_AFFILIATE_LINKS);

    // File state
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // UI state
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Route protection
    useEffect(() => {
        if (!isLoading && role !== UserRole.GLOBAL_ADMIN && role !== UserRole.CONTENT_ADMIN) {
            router.push('/');
        }
    }, [isLoading, role, router]);

    // Handle cover change
    const handleCoverChange = (file: File) => {
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
        setErrors(prev => ({ ...prev, cover: '' }));
    };

    const removeCover = () => {
        setCoverFile(null);
        setCoverPreview(null);
    };

    // Handle PDF change
    const handlePdfChange = (file: File) => {
        setPdfFile(file);
        setErrors(prev => ({ ...prev, pdf: '' }));
    };

    const removePdf = () => {
        setPdfFile(null);
    };

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = 'El título es requerido';
        if (!author.trim()) newErrors.author = 'El autor es requerido';
        if (!year.trim()) newErrors.year = 'El año es requerido';
        if (!category) newErrors.category = 'Selecciona una categoría';
        if (!coverFile) newErrors.cover = 'La portada es requerida';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!validateForm()) return;
        if (!user) {
            setErrors({ form: 'Debes estar autenticado para crear un libro' });
            return;
        }

        setIsSaving(true);
        setErrors({});

        try {
            let coverUrl = '';
            let pdfUrl = '';

            // Upload cover image
            if (coverFile) {
                const compressedCover = await compressBookCover(coverFile);
                const fileExt = compressedCover.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: coverError } = await supabase.storage
                    .from('book-covers')
                    .upload(fileName, compressedCover);

                if (coverError) {
                    setErrors({ cover: 'Error al subir la portada: ' + coverError.message });
                    setIsSaving(false);
                    return;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('book-covers')
                    .getPublicUrl(fileName);
                coverUrl = publicUrl;
            }

            // Upload PDF
            if (pdfFile) {
                const fileExt = pdfFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: pdfError } = await supabase.storage
                    .from('book-pdfs')
                    .upload(fileName, pdfFile);

                if (pdfError) {
                    setErrors({ pdf: 'Error al subir el PDF: ' + pdfError.message });
                    setIsSaving(false);
                    return;
                }

                const { data: signedData } = await supabase.storage
                    .from('book-pdfs')
                    .createSignedUrl(fileName, 60 * 60 * 24 * 365);
                pdfUrl = signedData?.signedUrl || '';
            }

            // Insert book record
            const validAffiliateLinks = affiliateLinks.filter(link => link.url.trim() !== '');

            const { error: bookError } = await supabase
                .from('books')
                .insert({
                    title: title.trim(),
                    subtitle: subtitle.trim() || null,
                    author: author.trim(),
                    year: parseInt(year),
                    isbn: isbn.trim() || null,
                    pages: pages ? parseInt(pages) : null,
                    category,
                    description: description.trim() || null,
                    price: price ? parseFloat(price) : null,
                    is_digital_only: isDigitalOnly,
                    cover_url: coverUrl,
                    pdf_url: pdfUrl || null,
                    affiliate_links: validAffiliateLinks,
                    status: 'draft',
                    created_by: user.id,
                });

            if (bookError) {
                setErrors({ form: 'Error al guardar el libro: ' + bookError.message });
                setIsSaving(false);
                return;
            }

            alert('¡Libro guardado correctamente!');
            router.push('/admin?section=catalog');

        } catch (error: any) {
            setErrors({ form: 'Error al guardar: ' + (error?.message || 'Error desconocido') });
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (role !== UserRole.GLOBAL_ADMIN && role !== UserRole.CONTENT_ADMIN) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-medium text-gray-800">Nuevo Libro</h1>
                            <p className="text-xs text-gray-500">Añadir al catálogo</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="button" className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 inline mr-2" />
                            Vista previa
                        </button>
                        <button
                            onClick={() => handleSubmit()}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving ? (
                                <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</>
                            ) : (
                                <><Save className="w-4 h-4" />Guardar libro</>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {errors.form && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{errors.form}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Cover & PDF */}
                    <div className="lg:col-span-1">
                        <BookCoverUpload
                            coverPreview={coverPreview}
                            error={errors.cover}
                            onCoverChange={handleCoverChange}
                            onRemove={removeCover}
                        />
                        <BookPdfUpload
                            pdfFile={pdfFile}
                            error={errors.pdf}
                            onPdfChange={handlePdfChange}
                            onRemove={removePdf}
                        />
                    </div>

                    {/* Right Column - Book Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <BookMetadataForm
                            title={title} setTitle={setTitle}
                            subtitle={subtitle} setSubtitle={setSubtitle}
                            author={author} setAuthor={setAuthor}
                            year={year} setYear={setYear}
                            isbn={isbn} setIsbn={setIsbn}
                            pages={pages} setPages={setPages}
                            category={category} setCategory={setCategory}
                            categories={CATEGORIES}
                            errors={errors}
                        />

                        {/* Description */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-medium text-gray-800 mb-4">Descripción</h2>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Escribe una descripción del libro..."
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <BookPricingSection
                            price={price} setPrice={setPrice}
                            isDigitalOnly={isDigitalOnly} setIsDigitalOnly={setIsDigitalOnly}
                        />

                        <AffiliateLinksSection
                            links={affiliateLinks}
                            onChange={setAffiliateLinks}
                        />

                        {/* Submit button (mobile) */}
                        <div className="lg:hidden">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</>
                                ) : (
                                    <><Save className="w-4 h-4" />Guardar libro</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
