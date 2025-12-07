"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, X, BookOpen } from 'lucide-react';
import { COLORS } from '@/constants';

// Mock post data - in production this would come from Supabase
const MOCK_POST = {
    id: 1,
    title: "El papel en la era de la pantalla infinita",
    category: "Reflexiones",
    date: "15 de Octubre, 2025",
    author: "Elena Varela",
    readingTime: 5,
    content: `
        <p class="lead">¿Tiene sentido seguir imprimiendo cuando todo está en la nube? Una defensa de la materialidad del libro.</p>
        
        <h2>La experiencia táctil</h2>
        <p>Hay algo innegablemente especial en sostener un libro físico. El peso en las manos, el olor del papel, el sonido de las páginas al pasar. Estas experiencias sensoriales no pueden ser replicadas por ninguna pantalla, por más avanzada que sea la tecnología.</p>
        
        <p>En un mundo donde pasamos horas frente a dispositivos digitales, el libro impreso ofrece un <strong>refugio táctil</strong>, una pausa del constante bombardeo de notificaciones y la luz azul de las pantallas.</p>

        <blockquote>
            "Un libro es un sueño que sostienes en tus manos." — Neil Gaiman
        </blockquote>

        <h2>La permanencia del papel</h2>
        <p>Mientras los formatos digitales cambian constantemente (¿recuerdan los disquetes?), los libros impresos han demostrado una durabilidad extraordinaria. Textos escritos hace siglos siguen siendo legibles hoy.</p>

        <ul>
            <li>No requieren electricidad ni actualizaciones</li>
            <li>No dependen de plataformas que pueden desaparecer</li>
            <li>Pueden pasar de generación en generación</li>
        </ul>

        <h2>El valor de lo tangible</h2>
        <p>En Ribla Editores creemos firmemente en el poder del objeto libro. Cada publicación es una cápsula de tiempo, un objeto de arte que trasciende su contenido textual.</p>

        <p>La materialidad importa. El diseño importa. La tipografía importa. <em>El papel importa.</em></p>
        
        <p>Cuando sostienes uno de nuestros libros, no solo estás leyendo palabras: estás experimentando una obra completa donde cada detalle ha sido cuidadosamente considerado.</p>

        <h2>Conclusión</h2>
        <p>El futuro no es digital o físico, sino la convivencia armoniosa de ambos mundos. Hay espacio para las pantallas y hay espacio para el papel. Lo importante es saber cuándo cada uno tiene sentido.</p>
        
        <p>Y nosotros seguiremos apostando por el papel, porque algunas experiencias simplemente no pueden ser digitalizadas.</p>
    `
};

export default function BlogPostPage() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setScrollProgress(progress);

            // Hide header on scroll down, show on scroll up
            if (scrollTop > lastScrollY && scrollTop > 100) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            setLastScrollY(scrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
                <div
                    className="h-full transition-all duration-150 ease-out"
                    style={{
                        width: `${scrollProgress}%`,
                        backgroundColor: COLORS.terracotta
                    }}
                />
            </div>

            {/* Minimal Header */}
            <header
                className={`fixed top-1 left-0 right-0 z-40 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/#journal"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm transition-colors bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Volver</span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full">
                        <Clock className="w-3 h-3" />
                        {MOCK_POST.readingTime} min de lectura
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-32">
                <article className="max-w-2xl mx-auto px-6">
                    {/* Category */}
                    <div className="flex items-center gap-3 mb-6">
                        <span
                            className="text-xs font-medium tracking-widest uppercase"
                            style={{ color: COLORS.terracotta }}
                        >
                            {MOCK_POST.category}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{MOCK_POST.date}</span>
                    </div>

                    {/* Title */}
                    <h1
                        className="text-4xl md:text-5xl leading-tight mb-6"
                        style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontWeight: 400,
                            color: '#2d2d2d',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        {MOCK_POST.title}
                    </h1>

                    {/* Author */}
                    <div className="flex items-center gap-3 mb-16 pb-8 border-b border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                                {MOCK_POST.author.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{MOCK_POST.author}</p>
                            <p className="text-xs text-gray-400">Colaborador</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="reading-content"
                        dangerouslySetInnerHTML={{ __html: MOCK_POST.content }}
                    />

                    {/* End of Article */}
                    <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                        <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                        <p className="text-sm text-gray-400 mb-6">Fin del artículo</p>
                        <Link
                            href="/#journal"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Journal
                        </Link>
                    </div>
                </article>
            </main>

            <style jsx global>{`
                .reading-content {
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 1.125rem;
                    line-height: 2;
                    color: #3d3d3d;
                }
                
                .reading-content p {
                    margin-bottom: 1.75em;
                    text-align: justify;
                    hyphens: auto;
                }
                
                .reading-content p.lead {
                    font-size: 1.25rem;
                    color: #555;
                    text-align: left;
                    margin-bottom: 2.5em;
                }
                
                .reading-content h2 {
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #2d2d2d;
                    margin-top: 3em;
                    margin-bottom: 1em;
                    text-align: left;
                    letter-spacing: -0.01em;
                }
                
                .reading-content blockquote {
                    border-left: 3px solid ${COLORS.terracotta};
                    padding: 1em 0 1em 2em;
                    margin: 2.5em 0;
                    font-style: italic;
                    color: #555;
                    font-size: 1.2rem;
                    text-align: left;
                    background: linear-gradient(90deg, rgba(217,107,39,0.05) 0%, transparent 100%);
                }
                
                .reading-content ul, .reading-content ol {
                    padding-left: 1.5em;
                    margin: 2em 0;
                }
                
                .reading-content li {
                    margin-bottom: 0.75em;
                    text-align: left;
                    padding-left: 0.5em;
                }
                
                .reading-content li::marker {
                    color: ${COLORS.terracotta};
                }
                
                .reading-content strong {
                    font-weight: 600;
                    color: #2d2d2d;
                }
                
                .reading-content em {
                    font-style: italic;
                }
                
                .reading-content a {
                    color: ${COLORS.terracotta};
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                
                .reading-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 2em 0;
                }

                /* Smooth selection */
                ::selection {
                    background-color: ${COLORS.desertSand};
                    color: #2d2d2d;
                }
            `}</style>
        </div>
    );
}
