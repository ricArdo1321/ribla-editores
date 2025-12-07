"use client";

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CATALOG, COLORS } from '../constants';
import { supabase } from '@/lib/supabaseClient';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  cover_url: string | null;
  status: string;
}

const Catalog: React.FC = () => {
  const [dbBooks, setDbBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('id, title, author, category, cover_url, status')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(6);

        if (!error && data) {
          setDbBooks(data);
        }
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Combine: show DB books first, fill with mock books if needed
  const displayBooks = dbBooks.length > 0
    ? dbBooks.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.category,
      coverUrl: book.cover_url || '/placeholder-cover.jpg',
    }))
    : CATALOG;

  return (
    <section id="catalog" className="py-24 md:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className="text-2xl md:text-3xl font-light mb-3 tracking-wide"
            style={{ color: COLORS.ashGray }}
          >
            {dbBooks.length > 0 ? 'Nuestro catálogo' : 'Nuestro catálogo inicial'}
          </h2>
          <p className="text-sm font-light text-gray-400 tracking-wide">
            {dbBooks.length > 0
              ? `${dbBooks.length} ${dbBooks.length === 1 ? 'libro publicado' : 'libros publicados'} en Ribla Editores.`
              : 'Seis libros que inauguran Ribla Editores.'
            }
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {displayBooks.map((book) => (
            <div key={book.id} className="group flex flex-col items-center md:items-start">

              {/* Cover */}
              <div className="w-full aspect-[2/3] bg-gray-50 mb-6 overflow-hidden relative">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>

              {/* Info */}
              <div className="w-full text-center md:text-left space-y-2">
                <span
                  className="inline-block px-2 py-0.5 border text-[10px] tracking-widest uppercase mb-1"
                  style={{
                    borderColor: 'rgba(74, 74, 72, 0.2)',
                    color: COLORS.ashGray
                  }}
                >
                  {book.genre}
                </span>

                <h3
                  className="text-xl font-normal leading-tight"
                  style={{ color: COLORS.ashGray }}
                >
                  {book.title}
                </h3>

                <p className="text-sm font-light text-gray-500">
                  {book.author}
                </p>

                <div className="pt-2">
                  <a
                    href={`/libro/${book.id}`}
                    className="inline-flex items-center text-xs tracking-widest font-medium border-b border-transparent hover:border-[#D96B27] transition-all group-hover:pl-1"
                    style={{ color: COLORS.terracotta }}
                  >
                    Ver ficha <ArrowRight size={12} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-24 text-center">
          <p className="text-xs font-light text-gray-400 max-w-md mx-auto leading-relaxed">
            Explora las fichas para ver sinopsis, formato digital e impreso y enlaces de compra.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Catalog;