'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { COLORS } from '@/constants';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-6">
            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-red-50 rounded-full">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <h2
                    className="text-2xl font-light mb-4"
                    style={{ color: COLORS.ashGray }}
                >
                    Algo salió mal
                </h2>

                <p className="text-gray-500 mb-8 font-light leading-relaxed">
                    Ha ocurrido un error inesperado al cargar esta página. Por favor, intenta recargar o vuelve más tarde.
                </p>

                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors tracking-wide"
                >
                    <RefreshCw className="w-4 h-4" />
                    Intentar de nuevo
                </button>
            </div>
        </div>
    );
}
