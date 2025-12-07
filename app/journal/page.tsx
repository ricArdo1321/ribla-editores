"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { COLORS } from '@/constants';

// Mock articles - in production this would come from Supabase
const ALL_ARTICLES = [
    {
        id: 1,
        slug: 'el-papel-en-la-era-digital',
        title: "El papel en la era de la pantalla infinita",
        category: "Reflexiones",
        date: "OCT 2025",
        excerpt: "¿Tiene sentido seguir imprimiendo cuando todo está en la nube? Una defensa de la materialidad del libro.",
        imageUrl: "https://picsum.photos/seed/journal1/800/500",
        author: "Elena Varela"
    },
    {
        id: 2,
        slug: 'conversacion-elena-varela',
        title: "Conversación con Elena Varela",
        category: "Entrevistas",
        date: "SEP 2025",
        excerpt: "La autora de 'El Silencio de los Algoritmos' nos habla sobre la ética en la inteligencia artificial.",
        imageUrl: "https://picsum.photos/seed/journal2/800/500",
        author: "Redacción"
    },
    {
        id: 3,
        slug: 'tipografia-emocional',
        title: "La tipografía como vehículo emocional",
        category: "Diseño",
        date: "AGO 2025",
        excerpt: "Cómo las decisiones tipográficas afectan la experiencia de lectura y la percepción del texto.",
        imageUrl: "https://picsum.photos/seed/journal3/800/500",
        author: "María del Carmen Soto"
    },
    {
        id: 4,
        slug: 'poesia-contemporanea',
        title: "Estado de la poesía contemporánea en Latinoamérica",
        category: "Ensayo",
        date: "JUL 2025",
        excerpt: "Un recorrido por las voces emergentes que están redefiniendo el género poético en la región.",
        imageUrl: "https://picsum.photos/seed/journal4/800/500",
        author: "Javier M. Sola"
    },
    {
        id: 5,
        slug: 'edicion-independiente',
        title: "El auge de la edición independiente",
        category: "Industria",
        date: "JUN 2025",
        excerpt: "Por qué cada vez más autores eligen publicar con editoriales pequeñas y qué significa para el ecosistema literario.",
        imageUrl: "https://picsum.photos/seed/journal5/800/500",
        author: "Sofía R. Costa"
    },
    {
        id: 6,
        slug: 'lectura-digital-papel',
        title: "Lectura digital vs papel: un falso dilema",
        category: "Reflexiones",
        date: "MAY 2025",
        excerpt: "Ambos formatos tienen su lugar. La clave está en saber cuándo usar cada uno.",
        imageUrl: "https://picsum.photos/seed/journal6/800/500",
        author: "Elena Varela"
    }
];

export default function JournalPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-8">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>

                    {/* Header */}
                    <div className="mb-16">
                        <h1
                            className="text-4xl md:text-5xl font-light tracking-wide mb-4"
                            style={{ color: COLORS.ashGray }}
                        >
                            Journal
                        </h1>
                        <p className="text-gray-500 max-w-2xl">
                            Reflexiones, entrevistas y ensayos sobre literatura, edición y el mundo del libro.
                        </p>
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {ALL_ARTICLES.map((article) => (
                            <Link
                                key={article.id}
                                href="/blog"
                                className="group"
                            >
                                <article className="cursor-pointer">
                                    {/* Image with page fold */}
                                    <div className="relative mb-4 aspect-[16/10] w-full bg-gray-100 rounded-lg overflow-hidden article-image-container">
                                        <img
                                            src={article.imageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                                        />
                                        {/* Page fold corner */}
                                        <div className="page-fold"></div>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="text-[10px] tracking-[0.15em] font-medium uppercase"
                                            style={{ color: COLORS.terracotta }}
                                        >
                                            {article.category}
                                        </span>
                                        <span className="w-px h-3 bg-gray-300"></span>
                                        <span className="text-[10px] tracking-widest text-gray-400">
                                            {article.date}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2
                                        className="text-lg font-normal leading-snug mb-2 group-hover:text-[#D96B27] transition-colors"
                                        style={{ color: COLORS.ashGray }}
                                    >
                                        {article.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                                        {article.excerpt}
                                    </p>

                                    {/* Author */}
                                    <p className="text-xs text-gray-400 mt-3">
                                        Por <span className="text-gray-600">{article.author}</span>
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center pb-16">
                        <button className="px-8 py-3 border border-gray-300 text-gray-600 text-sm rounded-full hover:bg-gray-50 transition-colors">
                            Cargar más artículos
                        </button>
                    </div>
                </div>
            </main>
            <Footer />

            <style jsx global>{`
                .article-image-container {
                    position: relative;
                }
                
                .page-fold {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 0 40px 40px 0;
                    border-color: transparent #fff transparent transparent;
                    filter: drop-shadow(-2px 2px 3px rgba(0,0,0,0.15));
                    transition: all 0.3s ease;
                }
                
                .page-fold::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: -40px;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 0 0 40px 40px;
                    border-color: transparent transparent rgba(0,0,0,0.1) transparent;
                }
                
                .group:hover .page-fold {
                    border-width: 0 50px 50px 0;
                }
                
                .group:hover .page-fold::before {
                    border-width: 0 0 50px 50px;
                    right: -50px;
                }
            `}</style>
        </>
    );
}
