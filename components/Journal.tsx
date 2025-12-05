import React from 'react';
import { ArrowRight } from 'lucide-react';
import { JOURNAL_POSTS, COLORS } from '../constants';

const Journal: React.FC = () => {
  return (
    <section id="journal" className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-100 pb-6">
          <h2 
            className="text-2xl md:text-3xl font-light tracking-wide"
            style={{ color: COLORS.ashGray }}
          >
            Journal
          </h2>
          <a 
            href="#" 
            className="hidden md:flex items-center text-xs tracking-widest text-gray-400 hover:text-[#D96B27] transition-colors mt-4 md:mt-0"
          >
            VER TODOS LOS ARTÍCULOS <ArrowRight size={12} className="ml-2" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {JOURNAL_POSTS.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <div className="overflow-hidden mb-6 aspect-[16/9] w-full bg-gray-50">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] tracking-[0.2em] font-medium text-[#D96B27] uppercase">
                  {post.category}
                </span>
                <span className="w-px h-3 bg-gray-300"></span>
                <span className="text-[10px] tracking-widest text-gray-400">
                  {post.date}
                </span>
              </div>

              <h3 
                className="text-xl md:text-2xl font-normal leading-tight mb-3 group-hover:text-[#D96B27] transition-colors"
                style={{ color: COLORS.ashGray }}
              >
                {post.title}
              </h3>

              <p className="text-sm font-light text-gray-400 leading-relaxed max-w-md">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="md:hidden mt-12 text-center">
             <a 
            href="#" 
            className="inline-flex items-center text-xs tracking-widest text-gray-400 hover:text-[#D96B27] transition-colors border-b border-gray-200 pb-1"
          >
            VER JOURNAL <ArrowRight size={12} className="ml-2" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default Journal;