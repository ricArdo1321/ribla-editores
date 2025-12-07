"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { supabase } from '@/lib/supabaseClient';
import {
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    FileText,
    X,
    Save,
    Eye,
    Loader2,
    BookOpen,
    Calendar,
    User,
    Tag,
    FileUp,
    Check,
    ExternalLink,
    Plus,
    Trash2
} from 'lucide-react';

// Book categories
const CATEGORIES = [
    'Narrativa',
    'Poesía',
    'Ensayo',
    'Crónica',
    'Infantil',
    'Académico',
    'Arte',
    'Historia',
    'Filosofía',
    'Otros'
];

export default function NewBookPage() {
    const router = useRouter();
    const { user, role, isLoading } = useAuth();
    const coverInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

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

    // Affiliate links
    const [affiliateLinks, setAffiliateLinks] = useState<{ name: string; url: string }[]>([
        { name: 'Amazon', url: '' },
        { name: 'Casa del Libro', url: '' },
        { name: 'Buscalibre', url: '' },
    ]);
    const [customLinkName, setCustomLinkName] = useState('');
    const [customLinkUrl, setCustomLinkUrl] = useState('');

    // File state
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // UI state
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Protect route - only GLOBAL_ADMIN and CONTENT_ADMIN
    useEffect(() => {
        if (!isLoading && role !== UserRole.GLOBAL_ADMIN && role !== UserRole.CONTENT_ADMIN) {
            router.push('/');
        }
    }, [isLoading, role, router]);

    // Handle cover image selection
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, cover: 'Solo se permiten imágenes' }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({ ...prev, cover: 'La imagen no puede superar 5MB' }));
                return;
            }
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, cover: '' }));
        }
    };

    // Handle PDF selection
    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setErrors(prev => ({ ...prev, pdf: 'Solo se permiten archivos PDF' }));
                return;
            }
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                setErrors(prev => ({ ...prev, pdf: 'El PDF no puede superar 50MB' }));
                return;
            }
            setPdfFile(file);
            setErrors(prev => ({ ...prev, pdf: '' }));
        }
    };

    // Remove cover
    const removeCover = () => {
        setCoverFile(null);
        setCoverPreview(null);
        if (coverInputRef.current) {
            coverInputRef.current.value = '';
        }
    };

    // Remove PDF
    const removePdf = () => {
        setPdfFile(null);
        if (pdfInputRef.current) {
            pdfInputRef.current.value = '';
        }
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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

            // 1. Upload cover image to Supabase Storage
            if (coverFile) {
                const fileExt = coverFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { data: coverData, error: coverError } = await supabase.storage
                    .from('book-covers')
                    .upload(fileName, coverFile);

                if (coverError) {
                    console.error('Cover upload error:', coverError);
                    setErrors({ cover: 'Error al subir la portada: ' + coverError.message });
                    setIsSaving(false);
                    return;
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('book-covers')
                    .getPublicUrl(fileName);

                coverUrl = publicUrl;
            }

            // 2. Upload PDF to Supabase Storage (if provided)
            if (pdfFile) {
                const fileExt = pdfFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { data: pdfData, error: pdfError } = await supabase.storage
                    .from('book-pdfs')
                    .upload(fileName, pdfFile);

                if (pdfError) {
                    console.error('PDF upload error:', pdfError);
                    setErrors({ pdf: 'Error al subir el PDF: ' + pdfError.message });
                    setIsSaving(false);
                    return;
                }

                // Get signed URL for private bucket
                const { data: signedData } = await supabase.storage
                    .from('book-pdfs')
                    .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

                pdfUrl = signedData?.signedUrl || '';
            }

            // 3. Filter affiliate links to only include ones with URLs
            const validAffiliateLinks = affiliateLinks.filter(link => link.url.trim() !== '');

            // 4. Insert book record into database
            const { data: book, error: bookError } = await supabase
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
                })
                .select()
                .single();

            if (bookError) {
                console.error('Book insert error:', bookError);
                setErrors({ form: 'Error al guardar el libro: ' + bookError.message });
                setIsSaving(false);
                return;
            }

            console.log('Book created:', book);
            router.push('/admin?section=catalog');

        } catch (error) {
            console.error('Unexpected error:', error);
            setErrors({ form: 'Error inesperado al guardar el libro' });
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
                        <Link
                            href="/admin"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-medium text-gray-800">Nuevo Libro</h1>
                            <p className="text-xs text-gray-500">Añadir al catálogo</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Eye className="w-4 h-4 inline mr-2" />
                            Vista previa
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar libro
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Cover Upload */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Portada del libro
                            </h2>

                            {/* Cover Preview/Upload */}
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
                                            onClick={removeCover}
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
                                            ref={coverInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.cover && (
                                <p className="text-xs text-red-500 mt-2">{errors.cover}</p>
                            )}

                            {/* PDF Upload */}
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
                                            onClick={removePdf}
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
                                            ref={pdfInputRef}
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handlePdfChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {errors.pdf && (
                                    <p className="text-xs text-red-500 mt-2">{errors.pdf}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Book Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
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
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                                    )}
                                </div>

                                {/* Subtitle */}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">
                                        Subtítulo
                                    </label>
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
                                            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.author ? 'border-red-300' : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.author && (
                                            <p className="text-xs text-red-500 mt-1">{errors.author}</p>
                                        )}
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
                                            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.year ? 'border-red-300' : 'border-gray-200'
                                                }`}
                                        />
                                        {errors.year && (
                                            <p className="text-xs text-red-500 mt-1">{errors.year}</p>
                                        )}
                                    </div>
                                </div>

                                {/* ISBN & Pages */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">
                                            ISBN
                                        </label>
                                        <input
                                            type="text"
                                            value={isbn}
                                            onChange={(e) => setIsbn(e.target.value)}
                                            placeholder="978-xxx-xxx-xxxx"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">
                                            Páginas
                                        </label>
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
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.category ? 'border-red-300' : 'border-gray-200'
                                            }`}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-medium text-gray-800 mb-4">
                                Descripción
                            </h2>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Escribe una descripción del libro..."
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-medium text-gray-800 mb-4">
                                Precio y disponibilidad
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">
                                        Precio (USD)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isDigitalOnly}
                                        onChange={(e) => setIsDigitalOnly(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Solo disponible en formato digital
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Affiliate Links */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Links de Afiliados
                            </h2>
                            <p className="text-xs text-gray-500 mb-4">
                                Añade enlaces a tiendas donde el libro esté disponible
                            </p>

                            <div className="space-y-3">
                                {affiliateLinks.map((link, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-28 flex-shrink-0">
                                            <span className="text-sm text-gray-600">{link.name}</span>
                                        </div>
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...affiliateLinks];
                                                newLinks[index].url = e.target.value;
                                                setAffiliateLinks(newLinks);
                                            }}
                                            placeholder={`https://${link.name.toLowerCase().replace(/\s/g, '')}.com/...`}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {/* Clear URL button for default links, delete button for custom links */}
                                        {index < 3 ? (
                                            // Default links (Amazon, Casa del Libro, Buscalibre) - just clear URL
                                            link.url && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newLinks = [...affiliateLinks];
                                                        newLinks[index].url = '';
                                                        setAffiliateLinks(newLinks);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Limpiar URL"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )
                                        ) : (
                                            // Custom links - can be fully deleted
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newLinks = affiliateLinks.filter((_, i) => i !== index);
                                                    setAffiliateLinks(newLinks);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Eliminar enlace"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Custom Link Input */}
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-2">Añadir otro enlace:</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={customLinkName}
                                            onChange={(e) => setCustomLinkName(e.target.value)}
                                            placeholder="Nombre de la tienda"
                                            className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="url"
                                            value={customLinkUrl}
                                            onChange={(e) => setCustomLinkUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (customLinkName && customLinkUrl) {
                                                    setAffiliateLinks([...affiliateLinks, { name: customLinkName, url: customLinkUrl }]);
                                                    setCustomLinkName('');
                                                    setCustomLinkUrl('');
                                                }
                                            }}
                                            disabled={!customLinkName || !customLinkUrl}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit button (mobile) */}
                        <div className="lg:hidden">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Guardar libro
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
