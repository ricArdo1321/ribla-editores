import React from 'react';
import { COLORS } from '../constants';

const Newsletter: React.FC = () => {
  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="max-w-xl mx-auto px-6 text-center">
        <h2 
          className="text-xl font-light mb-2 tracking-wide"
          style={{ color: COLORS.ashGray }}
        >
          Newsletter
        </h2>
        <p className="text-xs text-gray-400 font-light mb-10 tracking-wide">
          Recibe novedades, eventos y lecturas recomendadas.
        </p>

        <form className="flex flex-col md:flex-row items-end gap-6 md:gap-0">
          <div className="w-full relative">
            <input 
              type="email" 
              placeholder="Tu correo electrónico"
              className="w-full bg-transparent border-b border-gray-300 py-3 text-sm font-light text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#D96B27] transition-colors rounded-none"
            />
          </div>
          <button 
            type="button"
            className="w-full md:w-auto md:ml-6 px-8 py-3 bg-[#4A4A48] text-white text-[10px] tracking-[0.2em] hover:bg-[#D96B27] transition-colors whitespace-nowrap"
          >
            SUSCRIBIRSE
          </button>
        </form>
        
        <p className="mt-6 text-[9px] text-gray-300 text-left md:text-center">
          Al suscribirte aceptas nuestra política de privacidad. Sin spam, solo cultura.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;