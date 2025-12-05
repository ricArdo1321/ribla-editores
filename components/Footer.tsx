import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { COLORS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-white py-12 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        
        {/* Left: Copyright & Desc */}
        <div className="text-center md:text-left space-y-1">
          <p className="text-xs font-normal" style={{ color: COLORS.ashGray }}>
            © Ribla Editores, 2025.
          </p>
          <p className="text-[10px] text-gray-400 tracking-wide uppercase">
            Sello independiente de literatura, ciencia y cultura digital.
          </p>
        </div>

        {/* Center: Legal Links */}
        <div className="flex gap-6">
            {['Política de privacidad', 'Cookies', 'Contacto'].map(text => (
                <a 
                    key={text} 
                    href="#" 
                    className="text-[11px] text-gray-500 hover:text-[#D96B27] transition-colors"
                >
                    {text}
                </a>
            ))}
        </div>

        {/* Right: Social Icons */}
        <div className="flex gap-4">
          <a href="#" className="text-gray-300 hover:text-[#D96B27] transition-colors">
            <Instagram size={16} />
          </a>
          <a href="#" className="text-gray-300 hover:text-[#D96B27] transition-colors">
            <Twitter size={16} />
          </a>
          <a href="#" className="text-gray-300 hover:text-[#D96B27] transition-colors">
            <Facebook size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;