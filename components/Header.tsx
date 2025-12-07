'use client';

import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, X, Settings } from 'lucide-react';
import Link from 'next/link';
import { COLORS, NAV_LINKS } from '../constants';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

const Header: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  const isGlobalAdmin = role === UserRole.GLOBAL_ADMIN;

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
            <Link
              href="/"
              className={`uppercase tracking-[0.2em] font-light text-sm md:text-base transition-all duration-500 transform ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
              style={{ color: COLORS.ashGray }}
            >
              Ribla Editores
            </Link>
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
          <div className="flex-1 flex justify-end gap-6 items-center">
            {/* Admin Link - Only for Global Admin */}
            {isGlobalAdmin && (
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-2 hover:text-[#D96B27] transition-colors"
                style={{ color: COLORS.ashGray }}
                title="Panel de administración"
              >
                <Settings size={18} strokeWidth={1.5} />
                <span className="text-xs uppercase">Admin</span>
              </Link>
            )}

            {/* Content Admin Link - For Content Admin only */}
            {role === UserRole.CONTENT_ADMIN && (
              <Link
                href="/content-admin"
                className="hidden md:flex items-center gap-2 hover:text-[#D96B27] transition-colors"
                style={{ color: COLORS.ashGray }}
                title="Panel de contenidos"
              >
                <Settings size={18} strokeWidth={1.5} />
                <span className="text-xs uppercase">Contenidos</span>
              </Link>
            )}

            {/* Collaborator Link - For Collaborator only */}
            {role === UserRole.COLLABORATOR && (
              <Link
                href="/colaborador"
                className="hidden md:flex items-center gap-2 hover:text-[#D96B27] transition-colors"
                style={{ color: COLORS.ashGray }}
                title="Mi escritorio"
              >
                <User size={18} strokeWidth={1.5} />
                <span className="text-xs uppercase">Mi Escritorio</span>
              </Link>
            )}

            {/* User icon / Login */}
            {user ? (
              <div className="relative group hidden md:block">
                <button
                  className="flex items-center gap-2 hover:text-[#D96B27] transition-colors"
                  style={{ color: COLORS.ashGray }}
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-medium text-orange-600">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                {/* User dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      window.location.href = '/';
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 hover:text-[#D96B27] transition-colors"
                style={{ color: COLORS.ashGray }}
              >
                <User size={18} strokeWidth={1.5} />
                <span className="text-xs uppercase">Iniciar sesión</span>
              </Link>
            )}

            {/* Cart icon */}
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
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl md:text-4xl font-light tracking-wide hover:italic transition-all relative group"
                style={{ color: COLORS.ashGray }}
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D96B27] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Admin Link in Menu - Only for Global Admin */}
            {isGlobalAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl md:text-4xl font-light tracking-wide hover:italic transition-all relative group flex items-center gap-3"
                style={{ color: COLORS.terracotta }}
              >
                <Settings size={24} />
                Administración
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D96B27] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}

            {/* Content Admin Link in Menu - Only for Content Admin */}
            {role === UserRole.CONTENT_ADMIN && (
              <Link
                href="/content-admin"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl md:text-4xl font-light tracking-wide hover:italic transition-all relative group flex items-center gap-3"
                style={{ color: COLORS.araucariaGreen }}
              >
                <Settings size={24} />
                Panel de Contenidos
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#6C8A3D] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}

            {/* Collaborator Link in Menu - Only for Collaborator */}
            {role === UserRole.COLLABORATOR && (
              <Link
                href="/colaborador"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl md:text-4xl font-light tracking-wide hover:italic transition-all relative group flex items-center gap-3"
                style={{ color: COLORS.terracotta }}
              >
                <User size={24} />
                Mi Escritorio
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D96B27] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;