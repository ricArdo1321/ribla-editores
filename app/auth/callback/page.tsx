"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('Procesando autenticación...');

    useEffect(() => {
        const handleCallback = async () => {
            console.log('Auth callback starting...');
            console.log('Current URL:', window.location.href);

            try {
                // Method 1: Let Supabase handle the URL automatically
                // This works when tokens are in the hash or query params
                const { data, error: authError } = await supabase.auth.getSession();

                if (authError) {
                    console.error('Auth error:', authError);
                    setError('Error de autenticación: ' + authError.message);
                    return;
                }

                if (data.session) {
                    console.log('Session found for:', data.session.user.email);
                    setStatus('¡Sesión establecida! Redirigiendo...');

                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                    return;
                }

                // Method 2: If no session, try to extract tokens from URL hash
                const hash = window.location.hash;
                if (hash && hash.includes('access_token')) {
                    setStatus('Estableciendo sesión...');

                    const hashContent = hash.substring(1);
                    const hashParams = new URLSearchParams(hashContent);
                    const accessToken = hashParams.get('access_token');
                    const refreshToken = hashParams.get('refresh_token');

                    if (accessToken && refreshToken) {
                        console.log('Tokens found, setting session...');

                        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (sessionError) {
                            console.error('Session error:', sessionError);
                            setError('Error al establecer sesión: ' + sessionError.message);
                            return;
                        }

                        console.log('Session set for:', sessionData?.user?.email);
                        setStatus('¡Listo! Redirigiendo...');

                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1000);
                        return;
                    }
                }

                // Method 3: Check query params (some OAuth flows use this)
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');

                if (code) {
                    setStatus('Intercambiando código por sesión...');

                    // exchangeCodeForSession is handled automatically by Supabase
                    // when using the default PKCE flow
                    const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                    if (exchangeError) {
                        console.error('Code exchange error:', exchangeError);
                        setError('Error al procesar código: ' + exchangeError.message);
                        return;
                    }

                    console.log('Code exchanged, session for:', exchangeData?.user?.email);
                    setStatus('¡Listo! Redirigiendo...');

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                    return;
                }

                // No session and no tokens found
                console.log('No session or tokens found');
                setError('No se encontró información de sesión. Por favor intenta iniciar sesión de nuevo.');

            } catch (err: any) {
                console.error('Callback error:', err);
                setError('Error procesando autenticación: ' + (err?.message || 'Error desconocido'));
            }
        };

        handleCallback();

        // Safety timeout
        const timeout = setTimeout(() => {
            setError('La redirección está tardando demasiado. Haz clic abajo para continuar manualmente.');
        }, 10000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                {error ? (
                    <>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                        <div className="space-y-3">
                            <a
                                href="/login"
                                className="block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Volver a iniciar sesión
                            </a>
                            <a
                                href="/"
                                className="block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Ir al inicio
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium mb-2">{status}</p>
                        <p className="text-gray-500 text-sm">Por favor espera...</p>
                        <a
                            href="/"
                            className="text-sm text-orange-600 hover:underline mt-6 inline-block"
                        >
                            Si no redirige automáticamente, haz clic aquí
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}
