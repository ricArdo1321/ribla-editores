import React from 'react';
import { COLORS } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-[95vh] flex flex-col pt-16">
      
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
              className="text-5xl md:text-7xl lg:text-8xl font-thin tracking-tight leading-[0.9] mb-4"
              style={{ color: COLORS.ashGray }}
            >
              Ribla Editores
            </h1>
            <p className="text-sm md:text-base font-light text-gray-400 mb-2 tracking-wide">
              Literatura, ciencia y cultura digital para un mundo diverso.
            </p>
            <p className="text-xs text-gray-400 font-light italic">
              Un catálogo pequeño, escogido a mano: solo 6 libros para empezar.
            </p>
          </div>

          {/* Center/Right Product Card Block */}
          <div className="absolute top-1/2 right-6 md:right-24 transform -translate-y-1/2 text-right">
            <h2 className="text-lg md:text-xl font-normal tracking-wide" style={{ color: COLORS.ashGray }}>
              Catálogo 01
            </h2>
            <div className="text-sm font-light text-gray-400 mt-1 mb-6 space-y-1">
              <p>Seis títulos</p>
              <p>Edición 2025</p>
            </div>
            
            <a 
              href="#catalog"
              className="inline-block px-6 py-3 text-xs tracking-widest text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ 
                backgroundColor: COLORS.terracotta,
                borderRadius: '2px'
              }}
            >
              Ver los 6 libros
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