import React from 'react';
import { COLORS } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white border-t border-gray-50">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="space-y-6">
          <p 
            className="text-lg md:text-xl font-light leading-relaxed"
            style={{ color: COLORS.ashGray }}
          >
            Ribla Editores es un sello independiente que publica literatura, ensayo y pensamiento crítico en diálogo con la cultura digital.
          </p>
          <p 
            className="text-sm font-light text-gray-500 tracking-wide"
          >
            Creemos en los catálogos pequeños y en el cuidado de cada libro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;