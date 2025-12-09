"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { supabase } from '@/lib/supabaseClient';
import { compressBookCover } from '@/lib/imageCompression';
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
    ExternalLink,
    Plus,
    Trash2
} from 'lucide-react';

const CATEGORIES = [
    'Narrativa', 'Poesía', 'Ensayo', 'Crónica', 'Infantil',
    'Académico', 'Arte', 'Historia', 'Filosofía', 'Otros'
];

export const dynamic = 'force-dynamic';

export default function EditBookPage() {
    const router = useRouter();
    const params = useParams();
    const bookId = params.id as string;
    const { user, role, isLoading: authLoading } = useAuth();
    const coverInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    // Loading state
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [isbn, setIsbn] = useState('');
    const [pages, setPages] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isDigitalOnly, setIsDigitalOnly] = useState(false);
    const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
    const [existingPdfUrl, setExistingPdfUrl] = useState<string | null>(null);

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

    // Fetch book data
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .eq('id', bookId)
                    .single();

                if (error || !data) {
                    setLoadError('Libro no encontrado');
                    return;
                }

                // Populate form
                setTitle(data.title || '');
                setSubtitle(data.subtitle || '');
                setAuthor(data.author || '');
                setYear(data.year?.toString() || '');
                setIsbn(data.isbn || '');
                setPages(data.pages?.toString() || '');
                setCategory(data.category || '');
                setDescription(data.description || '');
                setPrice(data.price?.toString() || '');
                setIsDigitalOnly(data.is_digital_only || false);
                setExistingCoverUrl(data.cover_url);
                setExistingPdfUrl(data.pdf_url);

                // Set affiliate links
                if (data.affiliate_links && Array.isArray(data.affiliate_links)) {
                    const defaultLinks = [
                        { name: 'Amazon', url: '' },
                        { name: 'Casa del Libro', url: '' },
                        { name: 'Buscalibre', url: '' },
                    ];
                    data.affiliate_links.forEach((link: any) => {
                        const idx = defaultLinks.findIndex(l => l.name === link.name);
                        if (idx !== -1) {
                            defaultLinks[idx].url = link.url;
                        } else {
                            defaultLinks.push(link);
                        }
                    });
                    setAffiliateLinks(defaultLinks);
                }

                if (data.cover_url) {
                    setCoverPreview(data.cover_url);
                }
            } catch (err) {
                console.error('Error loading book:', err);
                setLoadError('Error al cargar el libro');
            } finally {
                setIsLoadingBook(false);
            }
        };

        if (bookId && !authLoading) {
            fetchBook();
        }
    }, [bookId, authLoading]);

    // Protect route
    useEffect(() => {
        if (!authLoading && role !== UserRole.GLOBAL_ADMIN && role !== UserRole.CONTENT_ADMIN) {
            router.push('/');
        }
    }, [authLoading, role, router]);

    // Handle cover image selection
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, cover: 'Solo se permiten imágenes' }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
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
            if (file.size > 50 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, pdf: 'El PDF no puede superar 50MB' }));
                return;
            }
            setPdfFile(file);
            setErrors(prev => ({ ...prev, pdf: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = 'El título es requerido';
        if (!author.trim()) newErrors.author = 'El autor es requerido';
        if (!year.trim()) newErrors.year = 'El año es requerido';
        if (!category) newErrors.category = 'Selecciona una categoría';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSaving(true);
        setErrors({});

        try {
            let coverUrl = existingCoverUrl || '';
            let pdfUrl = existingPdfUrl || '';

            // Upload new cover if selected (with compression)
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

            // Upload new PDF if selected
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

            // Filter affiliate links
            const validAffiliateLinks = affiliateLinks.filter(link => link.url.trim() !== '');

            // Update book record
            const { error: bookError } = await supabase
                .from('books')
                .update({
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
                })
                .eq('id', bookId);

            if (bookError) {
                setErrors({ form: 'Error al actualizar: ' + bookError.message });
                setIsSaving(false);
                return;
            }

            alert('¡Libro actualizado correctamente!');
            router.push('/admin/catalog');

        } catch (error: any) {
            console.error('Update error:', error);
            setErrors({ form: 'Error al actualizar: ' + (error?.message || 'Error desconocido') });
            setIsSaving(false);
        }
    };

    if (authLoading || isLoadingBook) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">{loadError}</p>
                    <Link href="/admin/catalog" className="text-blue-600 hover:underline">
                        Volver al catálogo
                    </Link>
                </div>
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
                        <Link href="/admin/catalog" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-medium text-gray-800">Editar Libro</h1>
                            <p className="text-xs text-gray-500">{title || 'Sin título'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={`/libro/${bookId}`}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Eye className="w-4 h-4 inline mr-2" />
                            Ver ficha
                        </Link>
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
                                    Guardar cambios
                                </>
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
                    {/* Left Column - Cover */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Portada del libro
                            </h2>

                            <div className="aspect-[2/3] relative bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                                {coverPreview ? (
                                    <>
                                        <img src={coverPreview} alt="Portada" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCoverFile(null);
                                                setCoverPreview(existingCoverUrl);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                        <span className="text-sm text-gray-500 text-center px-4">Subir nueva portada</span>
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
                            {errors.cover && <p className="text-xs text-red-500 mt-2">{errors.cover}</p>}

                            {/* Change Cover Button */}
                            {coverPreview && (
                                <label className="mt-4 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <Upload className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Cambiar portada</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Información básica
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">Título *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
                                    />
                                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">Subtítulo</label>
                                    <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">Autor *</label>
                                        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.author ? 'border-red-300' : 'border-gray-200'}`} />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">Año *</label>
                                        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.year ? 'border-red-300' : 'border-gray-200'}`} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">ISBN</label>
                                        <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">Páginas</label>
                                        <input type="number" value={pages} onChange={(e) => setPages(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">Categoría *</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.category ? 'border-red-300' : 'border-gray-200'}`}>
                                        <option value="">Seleccionar categoría</option>
                                        {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-medium text-gray-800 mb-4">Descripción</h2>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Escribe una descripción..."
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        {/* Price */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-medium text-gray-800 mb-4">Precio y disponibilidad</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">Precio (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={isDigitalOnly} onChange={(e) => setIsDigitalOnly(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <span className="text-sm text-gray-600">Solo disponible en formato digital</span>
                                </label>
                            </div>
                        </div>

                        {/* Affiliate Links */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Links de Afiliados
                            </h2>
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
                                        {index >= 3 && (
                                            <button
                                                type="button"
                                                onClick={() => setAffiliateLinks(affiliateLinks.filter((_, i) => i !== index))}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-2">Añadir otro enlace:</p>
                                    <div className="flex items-center gap-2">
                                        <input type="text" value={customLinkName} onChange={(e) => setCustomLinkName(e.target.value)} placeholder="Nombre" className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                        <input type="url" value={customLinkUrl} onChange={(e) => setCustomLinkUrl(e.target.value)} placeholder="https://..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (customLinkName && customLinkUrl) {
                                                    setAffiliateLinks([...affiliateLinks, { name: customLinkName, url: customLinkUrl }]);
                                                    setCustomLinkName(''); setCustomLinkUrl('');
                                                }
                                            }}
                                            disabled={!customLinkName || !customLinkUrl}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Submit */}
                        <div className="lg:hidden">
                            <button type="submit" disabled={isSaving} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : <><Save className="w-4 h-4" />Guardar cambios</>}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
