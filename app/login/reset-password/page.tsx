"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Check } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isValidLink, setIsValidLink] = useState(true);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

    const passwordRequirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
    };
    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

    useEffect(() => {
        const handleAuthSession = async () => {
            try {
                // Check URL hash for recovery tokens
                const hash = window.location.hash;
                console.log('URL hash:', hash);

                if (hash && hash.includes('type=recovery')) {
                    // Extract tokens from hash
                    const hashParams = new URLSearchParams(hash.substring(1));
                    const accessToken = hashParams.get('access_token');
                    const refreshToken = hashParams.get('refresh_token');

                    console.log('Recovery tokens found');

                    if (accessToken && refreshToken) {
                        const { error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (error) {
                            console.error('Session error:', error);
                            setIsValidLink(false);
                        } else {
                            console.log('Session set successfully');
                            setIsValidLink(true);
                        }
                    }
                } else {
                    // Check for existing session
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) {
                        setIsValidLink(false);
                    }
                }
            } catch (err) {
                console.error('Session check error:', err);
                setIsValidLink(false);
            } finally {
                setIsCheckingSession(false);
            }
        };

        handleAuthSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim() || !confirmPassword.trim()) {
            setError('Por favor, completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!isPasswordValid) {
            setError('La contraseña no cumple con los requisitos');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err?.message || 'Error al actualizar la contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!isValidLink) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        Enlace inválido
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Este enlace ha expirado o no es válido.
                    </p>
                    <Link
                        href="/login/forgot-password"
                        className="inline-flex items-center justify-center w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                                ¡Contraseña actualizada!
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Redirigiendo al login...
                            </p>
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <KeyRound className="w-8 h-8 text-blue-600" />
                                </div>
                                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                                    Nueva contraseña
                                </h1>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-600">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nueva contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <div className={`flex items-center gap-2 text-xs ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                                            <Check className={`w-3 h-3 ${passwordRequirements.minLength ? '' : 'opacity-0'}`} />
                                            Mínimo 8 caracteres
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                            <Check className={`w-3 h-3 ${passwordRequirements.hasUppercase ? '' : 'opacity-0'}`} />
                                            Una mayúscula
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                                            <Check className={`w-3 h-3 ${passwordRequirements.hasNumber ? '' : 'opacity-0'}`} />
                                            Un número
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar contraseña
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !isPasswordValid}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Actualizando...
                                        </>
                                    ) : (
                                        'Cambiar contraseña'
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
