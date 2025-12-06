'use client';

import React, { useState, useEffect } from 'react';
import { COLORS, CATALOG } from '../constants';

const Hero: React.FC = () => {
  const [count, setCount] = useState(0);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const target = CATALOG.length;
    const duration = 1200;
    const intervalTime = duration / target;

    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[95vh] md:h-[95vh] flex flex-col pt-16">

      {/* Top White Area (Content) */}
      <div className="flex-grow relative w-full bg-white">
        <div className="max-w-[1400px] mx-auto h-full px-6 md:px-12 relative">

          {/* Bottom Left Content Block */}
          <div className="absolute bottom-12 md:bottom-20 left-6 md:left-12 max-w-lg z-10">
            <span
              className="inline-block text-[10px] md:text-xs tracking-[0.25em] font-medium mb-4"
              style={{ color: COLORS.araucariaGreen }}
            >
              EDITORIAL EMERGENTE
            </span>
            <h1
              id="hero-main-title"
              className="text-5xl md:text-7xl lg:text-8xl font-thin tracking-tight leading-[0.9] mb-4 break-words"
              style={{ color: COLORS.ashGray }}
            >
              Ribla Editores
            </h1>
            <p className="text-sm md:text-base font-light text-gray-400 mb-2 tracking-wide">
              Literatura, ciencia y cultura digital para un mundo diverso.
            </p>
            <p className="text-xs text-gray-400 font-light italic">
              Un catálogo escogido a mano.
            </p>
          </div>

          {/* Center/Right Product Card Block */}
          <div className="absolute top-1/2 right-6 md:right-24 transform -translate-y-1/2 text-right">
            <h2 className="text-lg md:text-xl font-normal tracking-wide" style={{ color: COLORS.ashGray }}>
              Catálogo
            </h2>
            <div className="text-sm font-light text-gray-400 mt-1 mb-6 space-y-1">
              <p className="tabular-nums">
                {count} {count === 1 ? 'título' : 'títulos'}
              </p>
              <p>Edición {currentYear}</p>
            </div>

            <a
              href="#catalog"
              className="inline-block px-6 py-3 text-xs tracking-widest text-white transition-all hover:opacity-90 hover:scale-105"
              style={{
                backgroundColor: COLORS.terracotta,
                borderRadius: '2px'
              }}
            >
              Libros
            </a>
          </div>

        </div>
      </div>

      {/* Bottom Cropped Image */}
      <div className="h-[35vh] w-full overflow-hidden">
        <img
          src="https://picsum.photos/seed/papertexture2/1920/800"
          alt="Detalle editorial"
          className="w-full h-full object-cover object-bottom opacity-90 grayscale-[20%]"
        />
      </div>

    </section>
  );
};

export default Hero;