import React, { useState } from 'react';
import { COLORS } from '../constants';
import { supabase } from '../lib/supabaseClient';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ email, source: 'newsletter' }]);

      if (error) throw error;

      setStatus('success');
      setMessage('¡Gracias por suscribirte!');
      setEmail('');
    } catch (error: any) {
      console.error('Error subscribing:', error);
      setStatus('error');
      setMessage('Hubo un error al suscribirte. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-end gap-6 md:gap-0">
          <div className="w-full relative">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || status === 'success'}
              className="w-full bg-transparent border-b border-gray-300 py-3 text-sm font-light text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#D96B27] transition-colors rounded-none disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || status === 'success'}
            className="w-full md:w-auto md:ml-6 px-8 py-3 bg-[#4A4A48] text-white text-[10px] tracking-[0.2em] hover:bg-[#D96B27] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'ENVIANDO...' : status === 'success' ? 'SUSCRITO' : 'SUSCRIBIRSE'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-xs ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-[9px] text-gray-300 text-left md:text-center">
          Al suscribirte aceptas nuestra política de privacidad. Sin spam, solo cultura.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;