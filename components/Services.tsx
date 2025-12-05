import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES, COLORS } from '../constants';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-[#FAFAFA]">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 md:mb-24">
          <div className="max-w-md">
            <h2 
              className="text-2xl md:text-3xl font-light mb-4 tracking-wide"
              style={{ color: COLORS.ashGray }}
            >
              Servicios Editoriales
            </h2>
            <p className="text-sm font-light text-gray-400 leading-relaxed">
              Ponemos nuestra experiencia técnica y estética al servicio de autores independientes y otras editoriales.
            </p>
          </div>
          
          <div className="mt-8 md:mt-0">
             <a 
                href="mailto:servicios@riblaeditores.com"
                className="inline-flex items-center text-xs tracking-[0.2em] uppercase border-b border-gray-300 pb-1 hover:border-[#D96B27] hover:text-[#D96B27] transition-all"
                style={{ color: COLORS.ashGray }}
              >
                Solicitar tarifas <ArrowUpRight size={14} className="ml-2" />
              </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 border-t border-gray-200 pt-12">
          {SERVICES.map((service) => (
            <div key={service.id} className="group flex flex-col justify-between h-full">
              <div>
                <span 
                  className="block text-[10px] tracking-widest text-gray-300 mb-6"
                >
                  0{service.id}
                </span>
                <h3 
                  className="text-xl font-normal mb-4 group-hover:text-[#D96B27] transition-colors"
                  style={{ color: COLORS.ashGray }}
                >
                  {service.title}
                </h3>
                <p 
                  className="text-sm font-light text-gray-500 leading-relaxed mb-4"
                >
                  {service.description}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-light text-gray-400 italic">
                  {service.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;