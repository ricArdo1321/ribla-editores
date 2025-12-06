'use client';

import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, X } from 'lucide-react';
import { COLORS, NAV_LINKS } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const heroTitle = document.getElementById('hero-main-title');

    if (!heroTitle) {
      setShowLogo(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowLogo(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px'
      }
    );

    observer.observe(heroTitle);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300"
        style={{ borderTop: `4px solid ${COLORS.desertSand}` }}
      >
        <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* Left: Logo - Conditional Visibility */}
          <div className="flex-1 flex justify-start">
            <a
              href="#"
              className={`uppercase tracking-[0.2em] font-light text-sm md:text-base transition-all duration-500 transform ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
              style={{ color: COLORS.ashGray }}
            >
              Ribla Editores
            </a>
          </div>

          {/* Center: Menu Trigger */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="uppercase text-xs tracking-widest font-normal hover:text-[#D96B27] transition-colors"
              style={{ color: COLORS.ashGray }}
            >
              Menú
            </button>
          </div>

          {/* Right: Icons */}
          <div className="flex-1 flex justify-end gap-6">
            <button className="hidden md:block hover:text-[#D96B27] transition-colors" style={{ color: COLORS.ashGray }}>
              <User size={18} strokeWidth={1.5} />
            </button>
            <button className="hover:text-[#D96B27] transition-colors" style={{ color: COLORS.ashGray }}>
              <ShoppingBag size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Off-canvas Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-white transition-transform duration-500 ease-[bezier(0.76,0,0.24,1)] ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="absolute top-0 right-0 p-6">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:rotate-90 transition-transform duration-300"
            style={{ color: COLORS.ashGray }}
          >
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        <div className="h-full flex flex-col items-center justify-center">
          <nav className="flex flex-col items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl md:text-4xl font-light tracking-wide hover:italic transition-all relative group"
                style={{ color: COLORS.ashGray }}
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D96B27] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;